
import {BoardRange, Repeatability, Verticality} from "../../../../../config/units/traits.js"

export function renderRange(range: BoardRange) {
	return range.steps + (
		range.kind === "manhattan"
			? " (manhattan)"
			: ""
	)
}

export function renderRepeatable({count, focusFire}: Repeatability) {
	return `${count}` + (focusFire ? " (with focus fire)" : "(no focus fire)")
}

export function renderVerticality({above, below}: Verticality) {
	if (above || below)
		return (
			(above && below) ? "above+below"
			: above ? "above"
			: "below"
		)
	else
		return "flat"
}

