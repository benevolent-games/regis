
import {Vec2} from "@benev/toolbox"
import {Choice} from "../../../logic/state.js"
import {considerationFn, ConsiderationResult} from "../types.js"
import {calculateMovement} from "../../../logic/simulation/aspects/moving.js"
import {Denial, SoftDenial} from "../../../logic/simulation/aspects/denials.js"

export const considerMovement = considerationFn(
	({agent, proposers, commit}) =>
	(source: Vec2, target: Vec2) => {

	const nope: ConsiderationResult = {
		indicate: undefined,
		actuate: undefined,
	}

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
			indicate: "pattern",
			actuate: undefined,
		}
	else if (proposal instanceof Denial)
		return nope
	else
		return {
			indicate: "action",
			actuate: () => {
				proposal()
				commit(choice)
			},
		}
})

