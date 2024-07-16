
import {Pipe} from "@benev/slate"
import {Vec2, vec2, Vec3} from "@benev/toolbox"

import {Board} from "./board/board.js"

type Options = {
	board: Board
	blockSize: number
	blockHeight: number
}

export class Coordinator {
	constructor(private options: Options) {}

	toPosition(place: Vec2) {
		const tile = this.options.board.at(place)
		const y = (tile.elevation - 1) * this.options.blockHeight
		return Pipe.with(place)
			.to(v => vec2.subtract(v, this.#halfGridOffset))
			.to(v => vec2.add(v, [.5, .5]))
			.to(v => vec2.multiplyBy(v, this.options.blockSize))
			.to(([x, z]) => [x, y, z] as Vec3)
			.done()
	}

	toPlace(position: Vec3) {
		return Pipe.with(position)
			.to(([x,,z]) => [x, z] as Vec2)
			.to(v => vec2.divideBy(v, this.options.blockSize))
			.to(v => vec2.subtract(v, [.5, .5]))
			.to(v => vec2.add(v, this.#halfGridOffset))
			.to(v => vec2.applyBy(v, x => Math.floor(x)))
			.done()
	}

	/////////////////////////////

	get #halfGridOffset() {
		return vec2.divideBy(this.options.board.state.extent, 2)
	}
}

