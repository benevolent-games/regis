
import {BoardState, Tile} from "../state/board.js"
import {loop2d, scalar, Vec2} from "@benev/toolbox"

export class BoardHelper {
	constructor(public state: BoardState) {}

	index([file, rank]: Vec2) {
		return (rank * this.state.extent[0]) + file
	}

	#valid([file, rank]: Vec2) {
		return (
			scalar.within(file, 0, this.state.extent[0] - 1) &&
			scalar.within(rank, 0, this.state.extent[1] - 1)
		)
	}

	at(place: Vec2) {
		const [file, rank] = place

		if (!this.#valid(place))
			throw new Error(`invalid ascii map, rank ${rank}x${file} is not on the grid`)

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
		for (const place of loop2d(this.state.extent)) {
			yield {place, tile: this.at(place)}
		}
	}
}

