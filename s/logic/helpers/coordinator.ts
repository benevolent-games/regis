
import {Pipe} from "@benev/slate"
import {Vec2, vec2, Vec3} from "@benev/toolbox"

import {BoardHelper} from "./board.js"
import {constants} from "../../constants.js"
import {BoardState} from "../state/board.js"

export class CoordinatorHelper {
	constructor(private board: BoardState) {}

	toHeight(elevation: number) {
		const {verticalOffset, height} = constants.block
		return (elevation - 1 + verticalOffset) * height
	}

	toPosition(place: Vec2) {
		const tile = new BoardHelper(this.board).at(place)
		const y = this.toHeight(tile.elevation + (tile.step ? 0.5 : 0) + 1)
		return Pipe.with(place)
			.to(v => vec2.subtract(v, this.#halfGridOffset))
			.to(v => vec2.add(v, [.5, .5]))
			.to(v => vec2.multiplyBy(v, constants.block.size))
			.to(([x, z]) => [x, y, -z] as Vec3)
			.done()
	}

	toBlockPosition(place: Vec2) {
		let [x, y, z] = this.toPosition(place)
		y -= constants.block.height
		return [x, y, z] as Vec3
	}

	toPlace(position: Vec3) {
		return Pipe.with(position)
			.to(([x,,z]) => [x, -z] as Vec2)
			.to(v => vec2.divideBy(v, constants.block.size))
			.to(v => vec2.subtract(v, [.5, .5]))
			.to(v => vec2.add(v, this.#halfGridOffset))
			.to(v => vec2.applyBy(v, x => Math.round(x)))
			.done()
	}

	/////////////////////////////

	get #halfGridOffset() {
		return vec2.divideBy(this.board.extent, 2)
	}
}

