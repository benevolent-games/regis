
import {Vec2} from "@benev/toolbox"

export type Move = {
	kind: "move"
	from: Vec2
	to: Vec2
}

export type Attack = {
	kind: "attack"
	from: Vec2
	to: Vec2
}

export type Any = Move | Attack

