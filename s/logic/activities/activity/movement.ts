
import {vec2, Vec2} from "@benev/toolbox"
import {Choice} from "../../state.js"
import {calculateMovement} from "../../simulation/aspects/moving.js"
import {Proposal, Judgement, Rebuke, SoftRebuke, activity} from "../types.js"
import {canAfford, subtractResources} from "../../simulation/aspects/money.js"
import {isValidStep, isWithinRange} from "../../simulation/aspects/navigation.js"

export const movement = activity<Choice.Movement>()(({
		agent, freedom, turnTracker,
	}) => ({

	propose: (source: Vec2, target: Vec2) => {
		const unit = agent.units.at(source)
		if (!unit)
			return new Rebuke()

		const archetype = agent.archetype(unit.kind)

		if (!archetype.mobile)
			return new Rebuke()

		if (!isWithinRange(archetype.mobile.range, source, target))
			return new Rebuke()

		const movement = calculateMovement({agent, source, target})
		if (!movement)
			return new Rebuke()

		return new Proposal({
			kind: "movement",
			source,
			path: movement.path,
		})
	},

	judge: choice => {
		const unit = agent.units.at(choice.source)
		if (!unit)
			return new Rebuke()

		const archetype = agent.archetype(unit.kind)
		if (!archetype.mobile)
			return new Rebuke()

		const maxSteps = archetype.mobile.range.kind === "manhattan"
			? archetype.mobile.range.steps
			: archetype.mobile.range.steps + 1

		if (choice.path.length > maxSteps)
			return new Rebuke()

		const report = freedom.query(unit.id, archetype)
		if (!report?.available.moves)
			return new Rebuke()

		const destination = [...choice.path].pop()!
		const destinationStakingCost = agent.claims.stakingCost(
			agent.tiles.at(destination).claims
		)

		if (!turnTracker.ourTurn || turnTracker.teamId !== unit.team)
			return new SoftRebuke()

		if (agent.conclusion)
			return new SoftRebuke()

		let lastStep = choice.source

		for (const step of choice.path) {
			const placeA = lastStep
			const placeB = step
			const {verticality} = archetype.mobile
			if (isValidStep(agent, verticality, placeA, placeB))
				lastStep = placeB
			else
				break
		}

		let cost = 0

		if (archetype.stakeholder) {
			const hasMoved = !vec2.equal(lastStep, choice.source)
			const interrupted = !vec2.equal(lastStep, destination)
			if (hasMoved && interrupted) {
				const lastStepStakingCost = agent.claims.stakingCost(
					agent.tiles.at(lastStep).claims
				)
				if (lastStepStakingCost > 0)
					return new Rebuke()
			}

			if (hasMoved && !interrupted)
				cost += destinationStakingCost
		}

		if (!canAfford(agent.activeTeam, cost))
			return new Rebuke()

		return new Judgement(choice, () => {
			freedom.recordTask(unit.id, {kind: "move"})
			subtractResources(agent.state, agent.activeTeamId, cost)
			unit.place = lastStep
		})
	},
}))

