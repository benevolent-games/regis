
import {proposerFn} from "../types.js"
import {Choice} from "../../../state.js"
import {isValidStep} from "../../aspects/navigation.js"
import {boardCoords} from "../../../../tools/board-coords.js"
import {GameOverDenial, MovementDenial, WrongTeamDenial} from "../../aspects/denials.js"

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

	return () => {
		freedom.countMove(unit.id)
		unit.place = lastStep
	}
})

