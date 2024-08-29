
import {Vec2} from "@benev/toolbox"
import {Choice} from "../../../logic/state.js"
import {considerationFn, ConsiderationResult} from "../types.js"
import {Denial, SoftDenial} from "../../../logic/simulation/aspects/denials.js"

export const considerAttack = considerationFn(
	({agent, assets, proposers, instance, commit}) =>
	(source: Vec2, target: Vec2) => {

	const nope: ConsiderationResult = {
		indicate: undefined,
		actuate: undefined,
	}

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
		return nope
	else
		return {
			indicate: () => instance(assets.indicators.attack, target),
			actuate: () => {
				proposal()
				commit(choice)
			},
		}
})

