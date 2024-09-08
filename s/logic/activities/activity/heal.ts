
import {Vec2} from "@benev/toolbox"
import {Choice} from "../../state.js"
import {isWithinRange} from "../../simulation/aspects/navigation.js"
import {Judgement, Proposal, Rebuke, SoftRebuke, activity} from "../types.js"
import {isVerticallyCompatible} from "../../simulation/aspects/verticality.js"

export const heal = activity<Choice.Heal>()(({
		agent, unitTaskTracker, turnTracker,
	}) => ({

	propose: (source: Vec2, target: Vec2) => {
		const doctor = agent.units.at(source)
		const patient = agent.units.at(target)

		if (!doctor || !patient)
			return new Rebuke()

		return new Proposal({
			kind: "heal",
			doctorId: doctor.id,
			patientId: patient.id,
		})
	},

	judge: choice => {
		const {doctorId, patientId} = choice

		const doctor = agent.units.get(doctorId)
		const patient = agent.units.get(patientId)
		if (!doctor || !patient)
			return new Rebuke()

		const doctorArc = agent.archetype(doctor.kind)
		const {healer} = doctorArc
		if (!healer)
			return new Rebuke()

		const report = unitTaskTracker.query(doctor.id, doctorArc)
		if (!report?.canHeal(patient.id))
			return new Rebuke()

		if (patient.team !== doctor.team)
			return new Rebuke()

		const doctorTile = agent.tiles.at(doctor.place)
		const patientTile = agent.tiles.at(patient.place)

		if (!isVerticallyCompatible(healer.verticality, doctorTile, patientTile))
			return new Rebuke()

		if (!isWithinRange(healer.range, doctor.place, patient.place))
			return new Rebuke()

		const newDamageValue = Math.max(0, patient.damage - healer.healing)

		if (!turnTracker.ourTurn || turnTracker.teamId !== doctor.team)
			return new SoftRebuke()

		if (agent.conclusion)
			return new SoftRebuke()

		return new Judgement(choice, () => {
			unitTaskTracker.recordTask(doctor.id, {kind: "heal", targetId: patient.id})
			patient.damage = newDamageValue
		})
	},
}))

