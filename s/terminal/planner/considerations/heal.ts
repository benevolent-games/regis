
import {Vec2} from "@benev/toolbox"
import {considerationFn} from "../types.js"
import {Choice} from "../../../logic/state.js"
import {Denial, SoftDenial} from "../../../logic/simulation/aspects/denials.js"

export const considerHeal = considerationFn(
	({agent, proposers, commit}) =>
	(source: Vec2, target: Vec2) => {

	const doctor = agent.units.at(source)
	const patient = agent.units.at(target)

	if (!doctor || !patient)
		return {
			indicate: undefined,
			actuate: undefined,
		}

	const choice: Choice.Heal = {
		kind: "heal",
		doctorId: doctor.id,
		patientId: patient.id,
	}

	const proposal = proposers.heal(choice)

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


