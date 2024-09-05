
import {is} from "@benev/slate"
import {Unit} from "../state.js"
import {Archetype} from "../../config/units/archetype.js"

export type HealthReport = {
	total: number
	current: number
	fraction: number
}

export function healthReport(
		unit: Unit,
		{mortal}: Archetype,
	): HealthReport | null {

	if (is.unavailable(mortal?.health))
		return null

	const total = mortal.health
	const current = Math.max(0, total - unit.damage)
	const fraction = current / total
	return {total, current, fraction}
}

