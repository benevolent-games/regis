
import {loop, Vec2} from "@benev/toolbox"

export const letters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"]

export const numbers = [...loop(26)].map(i => i + 1)

export function boardCoords([x, y]: Vec2) {
	const alpha = letters[x]
	const bravo = numbers[y]

	if (!alpha || !bravo)
		throw new Error(`invalid board coords, [${x}, ${y}]`)

	return alpha + bravo
}

