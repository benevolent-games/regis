
import {Vec2} from "@benev/toolbox"

export function measureAsciiBoardExtent(ascii: string): Vec2 {
	const lines = ascii
		.split("\n")
		.map(s => s.trim())
		.filter(s => s.length > 0)

	const y = lines.length
	const x = lines.at(0)!
		.split(/\s+/)
		.filter(s => s.length > 0)
		.length

	return [x, y]
}

