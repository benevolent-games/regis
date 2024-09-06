
import {Vec2} from "@benev/toolbox"
import {considerationFn} from "../types.js"
import {Choice} from "../../../logic/state.js"
import {UnitKind} from "../../../config/units.js"
import {Denial, SoftDenial} from "../../../logic/simulation/aspects/denials.js"

export const considerRecruit = considerationFn(
	({proposers, commit}) =>
	(place: Vec2, unitKind: UnitKind) => {

	const choice: Choice.Recruit = {
		kind: "recruit",
		place,
		unitKind,
	}

	const proposal = proposers.recruit(choice)

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

