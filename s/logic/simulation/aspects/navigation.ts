
import {Agent} from "../../agent.js"
import {vec2, Vec2} from "@benev/toolbox"
import {VerticalCapability} from "../../state.js"
import {isVerticallyCompatible} from "./verticality.js"

export function getCardinalNeighbors(agent: Agent, place: Vec2) {
	return cardinals
		.map(v => vec2.add(place, v))
		.filter(v => agent.tiles.valid(v))
}

export function getNearby(agent: Agent, sourcePlace: Vec2, range: number) {
	return [...agent.tiles.list()]
		.filter(({place}) => isWithinRange(range, sourcePlace, place))
}

export const cardinals: Vec2[] = [
	[0, 1],
	[1, 0],
	[0, -1],
	[-1, 0],
]

export const ordinals: Vec2[] = [
	[1, 1],
	[-1, -1],
	[1, -1],
	[-1, 1],
]

export function manhattanDistance(a: Vec2, b: Vec2) {
	const [aX, aY] = a
	const [bX, bY] = b
	const distanceX = Math.abs(bX - aX)
	const distanceY = Math.abs(bY - aY)
	return distanceX + distanceY
}

export function isWithinRange(range: number, a: Vec2, b: Vec2) {
	return manhattanDistance(a, b) <= range
}

export function isValidStep(
		agent: Agent,
		verticality: VerticalCapability,
		placeA: Vec2,
		placeB: Vec2,
	) {
	const tileA = agent.tiles.at(placeA)
	const tileB = agent.tiles.at(placeB)
	const isVacant = !agent.units.at(placeB)
	const isCardinalNeighbor = getCardinalNeighbors(agent, placeA)
		.some(neighbor => vec2.equal(neighbor, placeB))
	return (
		isVacant &&
		isCardinalNeighbor &&
		isVerticallyCompatible(verticality, tileA, tileB)
	)
}

