
import {vec2, Vec2} from "@benev/toolbox"
import {Agent} from "../../agent.js"
import {pathfind} from "./pathfinding.js"

export function calculateMovement({
		agent,
		teamId,
		source,
		target,
	}: {
		agent: Agent,
		teamId: number,
		source: Vec2,
		target: Vec2,
	}) {

	if (vec2.equal(source, target))
		return null

	const unit = agent.units.at(source)

	if (unit?.team !== teamId)
		return null

	const archetype = agent.archetype(unit.kind)

	if (!archetype.move)
		return null

	const {verticality} = archetype.move
	const path = pathfind({agent, verticality, source, target})

	return (path && path.length <= archetype.move.range)
		? {
			unit,
			path,
			source,
			target,
			verticality,
			move: archetype.move,
		}
		: null
}

