
import {Agent} from "../../agent.js"
import {vec2, Vec2} from "@benev/toolbox"

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

