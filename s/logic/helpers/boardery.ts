
import {Board, Tile} from "../state/board.js"
import {loop2d, scalar, Vec2} from "@benev/toolbox"

export function boardery(board: Board) {
	return new Boardery(board)
}

export class Boardery {
	constructor(public board: Board) {}

	#index([file, rank]: Vec2) {
		return (rank * this.board.extent[0]) + file
	}

	#valid([file, rank]: Vec2) {
		return (
			scalar.within(file, 0, this.board.extent[0] - 1) &&
			scalar.within(rank, 0, this.board.extent[1] - 1)
		)
	}

	at(place: Vec2) {
		const [file, rank] = place
		if (!this.#valid(place))
			throw new Error(`invalid ascii map, rank ${rank}x${file} is not on the grid`)
		const index = this.#index(place)
		const tile = this.board.tiles[index]
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
		for (const place of loop2d(this.board.extent)) {
			yield {place, tile: this.at(place)}
		}
	}
}

