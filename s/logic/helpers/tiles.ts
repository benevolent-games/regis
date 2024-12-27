
import {BoardState, Tile} from "../state.js"
import {loop2d, Scalar, Vec2} from "@benev/toolbox"

export class TilesHelper {
	constructor(public state: BoardState) {}

	index({x: file, y: rank}: Vec2) {
		return (rank * this.state.extent.x) + file
	}

	valid({x: file, y: rank}: Vec2) {
		return (
			Scalar.isBetween(file, 0, this.state.extent.x - 1) &&
			Scalar.isBetween(rank, 0, this.state.extent.y - 1)
		)
	}

	at(place: Vec2) {
		const {x: file, y: rank} = place

		if (!this.valid(place))
			throw new Error(`place ${rank}x${file} is not on the grid`)

		const index = this.index(place)
		const tile = this.state.tiles[index]

		if (!tile)
			throw new Error(`tile not found`)

		return tile
	}

	where(tile: Tile) {
		for (const item of this.list())
			if (item.tile === tile)
				return item.place
		throw new Error(`tile not found`)
	}

	;*list() {
		for (const [x, y] of loop2d(this.state.extent.array())) {
			const place = new Vec2(x, y)
			yield {place, tile: this.at(place)}
		}
	}
}

