
import {vec2, Vec2} from "@benev/toolbox"
import {Agent} from "../../agent.js"
import {pathfind} from "./pathfinding.js"
import {isWithinRange} from "./navigation.js"

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

	if (!archetype.mobile)
		return null

	const {verticality} = archetype.mobile
	const path = pathfind({agent, verticality, source, target})

	if (!path)
		return null

	const {range} = archetype.mobile

	return isWithinRange(range, source, target)
		? {
			unit,
			path,
			source,
			target,
			verticality,
			mobile: archetype.mobile,
		}
		: null
}

