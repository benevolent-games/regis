
import {Vec2, Vec3} from "@benev/toolbox"

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
		const {x, y: z} = place.clone()
			.subtract(this.#halfGridOffset)
			.add_(.5, .5)
			.multiplyBy(constants.block.size)
		return new Vec3(x, y, -z)
	}

	toBlockPosition(place: Vec2) {
		let {x, y, z} = this.toPosition(place)
		y -= constants.block.height
		return new Vec3(x, y, z)
	}

	toPlace({x, z}: Vec3) {
		return new Vec2(x, -z)
			.divideBy(constants.block.size)
			.subtract_(.5, .5)
			.add(this.#halfGridOffset)
			.round()
	}

	/////////////////////////////

	get #halfGridOffset() {
		return Vec2.from(this.board.extent).clone().half()
	}
}

