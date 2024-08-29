
import {Vec2} from "@benev/toolbox"
import {considerationFn} from "../types.js"
import {Choice, UnitKind} from "../../../logic/state.js"
import {Denial, SoftDenial} from "../../../logic/simulation/aspects/denials.js"

export const considerSpawn = considerationFn(
	({proposers, commit}) =>
	(place: Vec2, unitKind: UnitKind) => {

	const choice: Choice.Spawn = {
		kind: "spawn",
		place,
		unitKind,
	}

	const proposal = proposers.spawn(choice)

	if (proposal instanceof SoftDenial)
		return {
			indicate: "pattern",
			actuate: undefined,
		}
	else if (proposal instanceof Denial)
		return {
			indicate: undefined,
			actuate: undefined,
		}
	else
		return {
			indicate: "action",
			actuate: () => {
				proposal()
				commit(choice)
			},
		}
})

