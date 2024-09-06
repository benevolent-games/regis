
import {vec2} from "@benev/toolbox"
import {proposerFn} from "../types.js"
import {Choice} from "../../../state.js"
import {isValidStep} from "../../aspects/navigation.js"
import {boardCoords} from "../../../../tools/board-coords.js"
import {canAfford, subtractResources} from "../../aspects/money.js"
import {GameOverDenial, MovementDenial, WrongTeamDenial} from "../../aspects/denials.js"

export const proposeMovement = proposerFn(
	({agent, freedom, turnTracker}) =>
	(choice: Choice.Movement) => {

	const unit = agent.units.at(choice.source)
	if (!unit)
		return new MovementDenial(`no unit found at ${boardCoords(choice.source)}`)

	const archetype = agent.archetype(unit.kind)
	if (!archetype.mobile)
		return new MovementDenial(`unit archetype "${unit.kind}" does not have move capability`)

	const report = freedom.query(unit.id, archetype)
	if (!report?.available.moves)
		return new MovementDenial(`unit "${unit.kind}" at ${boardCoords(choice.source)} does not have freedom to move`)

	const destination = [...choice.path].pop()!
	const destinationStakingCost = agent.claims.stakingCost(
		agent.tiles.at(destination).claims
	)

	if (!turnTracker.ourTurn || turnTracker.teamId !== unit.team)
		return new WrongTeamDenial()

	if (agent.conclusion)
		return new GameOverDenial()

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
				return new MovementDenial(`interrupted movement landed on a pricey claim, cancelled whole movement (this is rare)`)
		}

		if (hasMoved && !interrupted)
			cost += destinationStakingCost
	}

	if (!canAfford(agent.activeTeam, cost))
		return new MovementDenial(`cannot afford movement, staking cost too high`)

	return () => {
		freedom.recordTask(unit.id, {kind: "move"})
		subtractResources(agent.state, agent.activeTeamId, cost)
		unit.place = lastStep
	}
})

