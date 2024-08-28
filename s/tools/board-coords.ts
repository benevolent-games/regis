
import {Vec2} from "@benev/toolbox"

export const letters = [..."abcdefgh"]
export const numbers = [..."12345678"]

export function boardCoords([x, y]: Vec2) {
	const alpha = letters[x]
	const bravo = numbers[y]

	if (!alpha || !bravo)
		throw new Error(`invalid board coords, [${x}, ${y}]`)

	return alpha + bravo
}

