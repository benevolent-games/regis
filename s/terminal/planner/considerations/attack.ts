
import {Vec2} from "@benev/toolbox"
import {considerationFn} from "../types.js"
import {Choice} from "../../../logic/state.js"
import {Denial, SoftDenial} from "../../../logic/simulation/aspects/denials.js"

export const considerAttack = considerationFn(
	({assets, proposers, instance, commit}) =>
	(source: Vec2, target: Vec2) => {

	const choice: Choice.Attack = {
		kind: "attack",
		source,
		target,
	}

	const proposal = proposers.attack(choice)

	if (proposal instanceof SoftDenial)
		return {
			indicate: () => instance(assets.indicators.attack, target),
			actuate: undefined,
		}
	else if (proposal instanceof Denial)
		return {
			indicate: undefined,
			actuate: undefined,
		}
	else
		return {
			indicate: () => instance(assets.indicators.attack, target),
			actuate: () => {
				proposal()
				commit(choice)
			},
		}
})

