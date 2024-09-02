
import {vec2, Vec2} from "@benev/toolbox"
import {Agent} from "../../agent.js"
import {pathfind} from "./pathfinding.js"
import {chebyshevDistance} from "./navigation.js"

export function calculateMovement({
		agent,
		source,
		target,
	}: {
		agent: Agent,
		source: Vec2,
		target: Vec2,
	}) {

	if (vec2.equal(source, target))
		return null

	const unit = agent.units.at(source)
	if (!unit)
		return null

	const archetype = agent.archetype(unit.kind)

	if (!archetype.move)
		return null

	const {verticality} = archetype.move
	const path = pathfind({agent, verticality, source, target})

	if (!path)
		return null

	const {range, chebyshev} = archetype.move

	const withinRange = chebyshev
		? ((path.length <= (range + 1)) && chebyshevDistance(source, target) <= range)
		: (path.length <= range)

	return withinRange
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

