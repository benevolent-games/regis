//
// import {vec2, Vec2} from "@benev/toolbox"
// import {Agent} from "../../agent.js"
// import {Tile, Unit, VerticalCapability} from "../../state.js"
//
// export function findValidAttacks(agent: Agent, unit: Unit) {
// 	return [...agent.tiles.list()]
// 		.filter(target => isAttackValid(agent, unit.place, target.place))
// 		.map(target => target.place)
// }
//
// export function isAttackValid(agent: Agent, placeA: Vec2, placeB: Vec2) {
// 	const a = placeReport(agent, placeA)
// 	const b = placeReport(agent, placeB)
//
// 	if (!a.unit || !b.unit)
// 		return false
//
// 	if (a.unit.team === b.unit.team)
// 		return false
//
// 	const {attack} = agent.state.initial.config.unitArchetypes[a.unit.kind]
// 	return !!(
// 		attack &&
// 		isVerticallyAllowed(attack.verticality, a.tile, b.tile) &&
// 		isWithinRange(attack.range, a.place, b.place)
// 	)
// }
//
// export function findValidMoves(agent: Agent, unit: Unit) {
// 	return [...agent.tiles.list()]
// 		.filter(target => isMovementValid(agent, unit.place, target.place))
// 		.map(target => target.place)
// }
//
// export function isMovementValid(agent: Agent, placeA: Vec2, placeB: Vec2) {
// 	const a = placeReport(agent, placeA)
// 	const b = placeReport(agent, placeB)
//
// 	const {unit} = a
// 	const targetIsVacant = !b.unit
//
// 	if (!unit || !targetIsVacant)
// 		return false
//
// 	const {move} = agent.state.initial.config.unitArchetypes[unit.kind]
//
// 	return !!(
// 		move &&
// 		isVerticallyAllowed(move.verticality, a.tile, b.tile) &&
// 		isCardinalMove(a.place, b.place)
// 	)
// }
//
// function placeReport(agent: Agent, place: Vec2) {
// 	const unit = agent.units.at(place)
// 	const tile = agent.tiles.at(place)
// 	return {place, tile, unit}
// }
//
// export type VerticalityReport = {
// 	above: boolean
// 	below: boolean
// 	distance: number
// 	withinHalfStep: boolean
// 	withinFullStep: boolean
// }
//
// export function isVerticallyAllowed(allow: VerticalCapability, a: Tile, b: Tile) {
// 	const report = verticalityReport(a, b)
// 	return (
// 		(report.withinHalfStep) ||
// 		(allow.above && report.above && report.withinFullStep) ||
// 		(allow.below && report.below && report.withinFullStep)
// 	)
// }
//
// export function verticalityReport(a: Tile, b: Tile): VerticalityReport {
//
// 	// double the values, for clean integer-math, where 1 is a half-step
// 	const alpha = (a.elevation * 2) + (a.step ? 1 : 0)
// 	const bravo = (b.elevation * 2) + (b.step ? 1 : 0)
//
// 	const difference = bravo - alpha
// 	const negative = difference < 0
// 	const factor = Math.abs(difference)
// 	const withinHalfStep = factor <= 1
//
// 	return {
// 		above: !negative,
// 		below: negative,
// 		distance: factor / 2,
// 		withinFullStep: factor <= 2,
// 		withinHalfStep: withinHalfStep,
// 	}
// }
//
// export const cardinals: Vec2[] = [
// 	[0, 1],
// 	[1, 0],
// 	[0, -1],
// 	[-1, 0],
// ]
//
// export function isCardinalMove(a: Vec2, b: Vec2) {
// 	return cardinals
// 		.map(cardinal => vec2.add(a, cardinal))
// 		.some(proposal => vec2.equal(b, proposal))
// }
//
// export function isWithinRange(range: number, a: Vec2, b: Vec2) {
// 	const [aX, aY] = a
// 	const [bX, bY] = b
// 	const distanceX = Math.abs(bX - aX)
// 	const distanceY = Math.abs(bY - aY)
// 	return (
// 		(distanceX <= range) &&
// 		(distanceY <= range)
// 	)
// }
//
