
import {Pipe} from "@benev/slate"
import {Vec2, vec2, Vec3} from "@benev/toolbox"

import {boardery} from "./boardery.js"
import {Board} from "../state/board.js"
import {constants} from "../../babylon/constants.js"

export function coordinator(board: Board) {
	return new Coordinator(board)
}

export class Coordinator {
	constructor(private board: Board) {}

	toPosition(place: Vec2) {
		const tile = boardery(this.board).at(place)
		const y = (tile.elevation - 1) * constants.blockHeight
		return Pipe.with(place)
			.to(v => vec2.subtract(v, this.#halfGridOffset))
			.to(v => vec2.add(v, [.5, .5]))
			.to(v => vec2.multiplyBy(v, constants.blockSize))
			.to(([x, z]) => [x, y, z] as Vec3)
			.done()
	}

	toPlace(position: Vec3) {
		return Pipe.with(position)
			.to(([x,,z]) => [x, z] as Vec2)
			.to(v => vec2.divideBy(v, constants.blockSize))
			.to(v => vec2.subtract(v, [.5, .5]))
			.to(v => vec2.add(v, this.#halfGridOffset))
			.to(v => vec2.applyBy(v, x => Math.floor(x)))
			.done()
	}

	/////////////////////////////

	get #halfGridOffset() {
		return vec2.divideBy(this.board.extent, 2)
	}
}

