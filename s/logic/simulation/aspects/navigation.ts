
import {Vec2} from "@benev/toolbox"
import {Agent} from "../../agent.js"
import {isVerticallyCompatible} from "./verticality.js"
import {BoardRange, Verticality} from "../../../config/units/traits.js"

export function getCardinalNeighbors(agent: Agent, place: Vec2) {
	return cardinals
		.map(v => v.clone().add(place))
		.filter(v => agent.tiles.valid(v))
}

export function getNearby(agent: Agent, sourcePlace: Vec2, range: BoardRange) {
	return [...agent.tiles.list()]
		.filter(({place}) => isWithinRange(range, sourcePlace, place))
}

export const cardinals: Vec2[] = [
	Vec2.new(0, 1),
	Vec2.new(1, 0),
	Vec2.new(0, -1),
	Vec2.new(-1, 0),
]

export const ordinals: Vec2[] = [
	Vec2.new(1, 1),
	Vec2.new(-1, -1),
	Vec2.new(1, -1),
	Vec2.new(-1, 1),
]

export function manhattanDistance(a: Vec2, b: Vec2) {
	const distanceX = Math.abs(b.x - a.x)
	const distanceY = Math.abs(b.y - a.y)
	return distanceX + distanceY
}

export function chebyshevDistance(a: Vec2, b: Vec2) {
	const distanceX = Math.abs(b.x - a.x)
	const distanceY = Math.abs(b.y - a.y)
	return Math.max(distanceX, distanceY)
}

export function isWithinRange(range: BoardRange, a: Vec2, b: Vec2) {
	const kind = range.kind ?? "chebyshev"
	const distance = kind === "chebyshev"
		? chebyshevDistance(a, b)
		: manhattanDistance(a, b)
	return distance <= range.steps
}

export function isValidStep(
		agent: Agent,
		verticality: Verticality | undefined,
		placeA: Vec2,
		placeB: Vec2,
	) {
	const tileA = agent.tiles.at(placeA)
	const tileB = agent.tiles.at(placeB)
	const isVacant = !agent.units.at(placeB)
	const isCardinalNeighbor = getCardinalNeighbors(agent, placeA)
		.some(neighbor => neighbor.equals(placeB))

	return (
		isVacant &&
		isCardinalNeighbor &&
		isVerticallyCompatible(verticality, tileA, tileB)
	)
}

