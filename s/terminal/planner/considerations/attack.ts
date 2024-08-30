
import {Vec2} from "@benev/toolbox"
import {considerationFn} from "../types.js"
import {Choice} from "../../../logic/state.js"
import {Denial, SoftDenial} from "../../../logic/simulation/aspects/denials.js"

export const considerAttack = considerationFn(
	({agent, proposers, commit}) =>
	(source: Vec2, target: Vec2) => {

	const attacker = agent.units.at(source)
	const victim = agent.units.at(target)

	if (!attacker || !victim)
		return {
			indicate: undefined,
			actuate: undefined,
		}

	const choice: Choice.Attack = {
		kind: "attack",
		attackerId: attacker.id,
		victimId: victim.id,
	}

	const proposal = proposers.attack(choice)

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

