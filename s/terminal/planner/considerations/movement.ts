
import {Vec2} from "@benev/toolbox"
import {Choice} from "../../../logic/state.js"
import {considerationFn, ConsiderationResult} from "../types.js"
import {calculateMovement} from "../../../logic/simulation/aspects/moving.js"
import {Denial, SoftDenial} from "../../../logic/simulation/aspects/denials.js"

export const considerMovement = considerationFn(
	({agent, assets, freedom, proposers, instance, commit}) =>
	(source: Vec2, target: Vec2) => {

	const nope: ConsiderationResult = {
		indicate: undefined,
		actuate: undefined,
	}

	const unit = agent.units.at(source)

	if (!unit)
		return nope

	const archetype = agent.archetype(unit.kind)
	const {canMove} = freedom.report(unit.id, archetype)

	if (!canMove)
		return nope

	const movement = calculateMovement({agent, source, target})

	if (!movement)
		return nope

	const choice: Choice.Movement = {
		kind: "movement",
		source,
		path: movement.path,
	}

	const proposal = proposers.movement(choice)

	if (proposal instanceof SoftDenial)
		return {
			indicate: () => instance(assets.indicators.libertyPattern, target),
			actuate: undefined,
		}
	else if (proposal instanceof Denial)
		return nope
	else
		return {
			indicate: () => instance(assets.indicators.libertyAction, target),
			actuate: () => {
				proposal()
				commit(choice)
			},
		}
})

