
import {proposerFn} from "../types.js"
import {Choice} from "../../../state.js"
import {isValidStep} from "../../aspects/navigation.js"
import {boardCoords} from "../../../../tools/board-coords.js"
import {GameOverDenial, MovementDenial, WrongTeamDenial} from "../../aspects/denials.js"
import { vec2 } from "@benev/toolbox"
import { subtractResources } from "../../aspects/money.js"

export const proposeMovement = proposerFn(
	({agent, freedom, turnTracker}) =>
	(choice: Choice.Movement) => {

	const unit = agent.units.at(choice.source)
	if (!unit)
		return new MovementDenial(`no unit found at ${boardCoords(choice.source)}`)

	const archetype = agent.archetype(unit.kind)
	if (!archetype.move)
		return new MovementDenial(`unit archetype "${unit.kind}" does not have move capability`)

	const {canMove} = freedom.report(unit.id, archetype)
	if (!canMove)
		return new MovementDenial(`unit "${unit.kind}" at ${boardCoords(choice.source)} does not have freedom to move`)

	const destination = [...choice.path].pop()!
	const destinationStakingCost = agent.claims.getStakingCost(destination)

	if (!turnTracker.ourTurn || turnTracker.teamIndex !== unit.team)
		return new WrongTeamDenial()

	if (agent.conclusion)
		return new GameOverDenial()

	let lastStep = choice.source

	for (const step of choice.path) {
		const placeA = lastStep
		const placeB = step
		const {verticality} = archetype.move
		if (isValidStep(agent, verticality, placeA, placeB))
			lastStep = placeB
		else
			break
	}

	const hasMoved = !vec2.equal(lastStep, choice.source)
	const interrupted = !vec2.equal(lastStep, destination)
	if (hasMoved && interrupted) {
		const lastStepStakingCost = agent.claims.getStakingCost(lastStep)
		if (lastStepStakingCost > 0)
			return new MovementDenial(`interrupted movement landed on a pricey claim, cancelled whole movement (this is rare)`)
	}

	const cost = (hasMoved && !interrupted)
		? destinationStakingCost
		: 0

	return () => {
		freedom.countMove(unit.id)
		subtractResources(agent.state, agent.activeTeamIndex, cost)
		unit.place = lastStep
	}
})

