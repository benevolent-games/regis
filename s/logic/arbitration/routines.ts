
import {vec2, Vec2} from "@benev/toolbox"
import {Agent} from "../agent.js"
import {Tile} from "../state/board.js"
import {Unit, unitArchetypes, Verticality} from "../state/units.js"

export function findValidMoves(agent: Agent, unit: Unit) {
	return [...agent.board.list()]
		.filter(target => isMovementValid(agent, unit.place, target.place))
		.map(target => target.place)
	// const validMoves: Vec2[] = []
	// const unitTile = agent.board.at(unit.place)
	// for (const target of agent.board.list()) {
	// 	const {move} = unitArchetypes[unit.kind]
	// 	const isVacant = !agent.units.at(target.place)
	// 	const isValid = !!(
	// 		move &&
	// 		isVacant &&
	// 		isVerticallyAllowed(move.verticality, unitTile, target.tile) &&
	// 		isCardinalMove(unit.place, target.place)
	// 	)
	// 	if (isValid)
	// 		validMoves.push(target.place)
	// }
	//
	// return validMoves
}

export function isMovementValid(agent: Agent, placeA: Vec2, placeB: Vec2) {
	const a = placeReport(agent, placeA)
	const b = placeReport(agent, placeB)
	const {unit} = a
	const targetIsVacant = !b.unit

	if (!unit || !targetIsVacant)
		return false

	const {move} = unitArchetypes[unit.kind]

	return (
		move &&
		isVerticallyAllowed(move.verticality, a.tile, b.tile) &&
		isCardinalMove(a.place, b.place)
	)
}

function placeReport(agent: Agent, place: Vec2) {
	const unit = agent.units.at(place)
	const tile = agent.board.at(place)
	return {place, tile, unit}
}

export type VerticalityReport = {
	factor: number
	same: boolean
	above: boolean
	below: boolean
}

export function isVerticallyAllowed(allow: Verticality, a: Tile, b: Tile) {
	const report = verticalityReport(a, b)
	return (
		(allow.same && report.same) ||
		(allow.above && report.above) ||
		(allow.below && report.below)
	)
}

export function verticalityReport(a: Tile, b: Tile) {
	const difference = b.elevation - a.elevation

	const negative = difference < 0
	const stepInvolved = a.step || b.step
	const distance = Math.abs(difference)
	const factor = Math.max(0, distance - (stepInvolved ? 1 : 0))

	const same = factor === 0
	const above = (factor > 0) && !negative
	const below = (factor > 0) && negative

	return {factor, same, above, below}
}

export const cardinals: Vec2[] = [
	[0, 1],
	[1, 0],
	[0, -1],
	[-1, 0],
]

export function isCardinalMove(a: Vec2, b: Vec2) {
	return cardinals
		.map(cardinal => vec2.add(a, cardinal))
		.some(proposal => vec2.equal(b, proposal))
}

export function isWithinRange(range: number, a: Vec2, b: Vec2) {
	const [aX, aY] = a
	const [bX, bY] = b
	const distanceX = Math.abs(bX - aX)
	const distanceY = Math.abs(bY - aY)
	return (
		(distanceX <= range) &&
		(distanceY <= range)
	)
}

