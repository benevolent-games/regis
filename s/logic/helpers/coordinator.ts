
import {Pipe} from "@benev/slate"
import {Vec2, vec2, Vec3} from "@benev/toolbox"

import {TilesHelper} from "./tiles.js"
import {BoardState, Tile} from "../state.js"
import {constants} from "../../constants.js"

export class CoordinatorHelper {
	constructor(private board: BoardState) {}

	/** count the step as an elevation half-step */
	elevationWithStep(tile: Tile) {
		return tile.elevation + (tile.step ? 0.5 : 0)
	}

	/** get height at the top of this tile */
	tileHeight(tile: Tile) {
		const elevation = this.elevationWithStep(tile)
		return this.elevationHeight(elevation)
	}

	/** get the height at the top of a block at this elevation */
	elevationHeight(elevation: number) {
		const {verticalOffset, height} = constants.block
		return (elevation + verticalOffset) * height
	}

	/** get the position at the center of the top face of the tile at this place */
	toPosition(place: Vec2) {
		const tile = new TilesHelper(this.board).at(place)
		const y = this.tileHeight(tile)
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

