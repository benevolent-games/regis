
import {getVerticalCapability, Tile, VerticalCapability, Verticality} from "../../state.js"

export type VerticalCompatibility = {
	above: boolean
	below: boolean
	distance: number
	withinHalfStep: boolean
	withinFullStep: boolean
}

export function isVerticallyCompatible(verticality: Verticality, a: Tile, b: Tile) {
	const allow = getVerticalCapability(verticality)
	const report = verticalCompatibilityReport(a, b)
	return (
		(report.withinHalfStep) ||
		(allow.above && report.above) ||
		(allow.below && report.below)
	)
}

function verticalCompatibilityReport(a: Tile, b: Tile): VerticalCompatibility {

	// double the values, for clean integer-math, where 1 is a half-step
	const alpha = (a.elevation * 2) + (a.step ? 1 : 0)
	const bravo = (b.elevation * 2) + (b.step ? 1 : 0)

	const difference = bravo - alpha
	const negative = difference < 0
	const factor = Math.abs(difference)
	const withinHalfStep = factor <= 1

	return {
		above: !negative,
		below: negative,
		distance: factor / 2,
		withinFullStep: factor <= 2,
		withinHalfStep: withinHalfStep,
	}
}

