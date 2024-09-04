
import {proposerFn} from "../types.js"
import {Choice, getVerticalCapability} from "../../../state.js"
import {GameOverDenial, HealDenial, WrongTeamDenial} from "../../aspects/denials.js"
import { isVerticallyCompatible } from "../../aspects/verticality.js"
import { isWithinRange } from "../../aspects/navigation.js"

export const proposeHeal = proposerFn(
	({agent, freedom, turnTracker}) =>
	(choice: Choice.Heal) => {

	const {doctorId, patientId} = choice

	const doctor = agent.units.get(doctorId)
	const patient = agent.units.get(patientId)
	if (!doctor || !patient)
		return new HealDenial("doctor or patient not found")

	const doctorArc = agent.archetype(doctor.kind)
	const {heal} = doctorArc
	if (!heal)
		return new HealDenial("doctor does not have heal capability")

	const {canHeal} = freedom.report(doctor.id, doctorArc)
	if (!canHeal)
		return new HealDenial("unit does not have freedom to heal")

	if (patient.team !== doctor.team)
		return new HealDenial("doctor and patient are not on the same team")

	const doctorTile = agent.tiles.at(doctor.place)
	const patientTile = agent.tiles.at(patient.place)
	if (!isVerticallyCompatible(heal.verticality, doctorTile, patientTile))
		return new HealDenial("vertically incompatible")

	if (!isWithinRange(heal.range, doctor.place, patient.place))
		return new HealDenial("out of range")

	const newDamageValue = Math.max(0, patient.damage - heal.amount)

	if (!turnTracker.ourTurn || turnTracker.teamId !== doctor.team)
		return new WrongTeamDenial()

	if (agent.conclusion)
		return new GameOverDenial()

	return () => {
		freedom.countHeal(doctor.id)
		patient.damage = newDamageValue
	}
})

