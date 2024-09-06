
import {proposerFn} from "../types.js"
import {Choice} from "../../../state.js"
import {isWithinRange} from "../../aspects/navigation.js"
import {isVerticallyCompatible} from "../../aspects/verticality.js"
import {GameOverDenial, HealDenial, WrongTeamDenial} from "../../aspects/denials.js"

export const proposeHeal = proposerFn(
	({agent, freedom, turnTracker}) =>
	(choice: Choice.Heal) => {

	const {doctorId, patientId} = choice

	const doctor = agent.units.get(doctorId)
	const patient = agent.units.get(patientId)
	if (!doctor || !patient)
		return new HealDenial("doctor or patient not found")

	const doctorArc = agent.archetype(doctor.kind)
	const {healer} = doctorArc
	if (!healer)
		return new HealDenial("doctor does not have heal capability")

	const report = freedom.query(doctor.id, doctorArc)
	if (!report?.canHeal(patient.id))
		return new HealDenial("unit does not have freedom to heal")

	if (patient.team !== doctor.team)
		return new HealDenial("doctor and patient are not on the same team")

	const doctorTile = agent.tiles.at(doctor.place)
	const patientTile = agent.tiles.at(patient.place)
	if (!isVerticallyCompatible(healer.verticality, doctorTile, patientTile))
		return new HealDenial("vertically incompatible")

	if (!isWithinRange(healer.range, doctor.place, patient.place))
		return new HealDenial("out of range")

	const newDamageValue = Math.max(0, patient.damage - healer.healing)

	if (!turnTracker.ourTurn || turnTracker.teamId !== doctor.team)
		return new WrongTeamDenial()

	if (agent.conclusion)
		return new GameOverDenial()

	return () => {
		freedom.recordTask(doctor.id, {kind: "heal", targetId: patient.id})
		patient.damage = newDamageValue
	}
})

