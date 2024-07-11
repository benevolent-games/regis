
import { pubsub } from "@benev/slate"
import {loop2d, Vec2} from "@benev/toolbox"

/** location coordinates for a spot on the chess board */
export class Place {
	static coords(file: number, rank: number) {
		return new this([file, rank])
	}

	static at({rank, file}: {rank: number, file: number}) {
		return new this([file, rank])
	}

	/** corresponds to worldZ */
	rank = 0

	/** corresponds to worldX */
	file = 0

	constructor([file, rank]: Vec2 = [0, 0]) {
		this.rank = rank
		this.file = file
	}

	get vector(): Vec2 {
		return [this.file, this.rank]
	}

	same({rank, file}: Place) {
		return (
			rank === this.rank &&
			file === this.file
		)
	}
}

/** information about a tile on the board */
export class Tile {
	elevation = 0
}

/** data structure to hold all tiles on the board */
export class Grid {
	extent: Vec2 = [8, 8]
	#array = [...loop2d(this.extent)].map(() => new Tile())

	at({rank, file}: Place) {
		const index = (rank * this.extent[0]) + file
		const tile = this.#array[index]
		if (!tile) throw new Error(`tile not found`)
		return tile
	}

	;*loop() {
		for (const vector of loop2d(this.extent)) {
			const place = new Place(vector)
			yield {place, tile: this.at(place)}
		}
	}
}

export abstract class Unit {}
export class King extends Unit {}
export class Queen extends Unit {}
export class Bishop extends Unit {}
export class Knight extends Unit {}
export class Rook extends Unit {}
export class Pawn extends Unit {}

export class Placements {
	#map = new Map<Unit, Place>()

	at(query: Place) {
		for (const [unit, place] of this.#map)
			if (place.same(query))
				return unit
	}

	;*loop() {
		for (const [unit, place] of this.#map)
			yield {unit, place}
	}

	put(unit: Unit, place: Place) {
		const existing = this.at(place)
		if (existing)
			this.#map.delete(existing)
		else
			this.#map.set(unit, place)
	}
}

type Selectoid = {
	place: Place
	tile: Tile
	unit: Unit | undefined
}

export class Selectacon {
	selected: Selectoid | undefined
	onSelected = pubsub<[Selectoid | undefined]>()

	constructor(private grid: Grid, private placements: Placements) {}

	select(place: Place) {
		const tile = this.grid.at(place)
		const unit = this.placements.at(place)
		const selected = {place, tile, unit}
		this.selected = selected
		this.onSelected.publish(selected)
		return selected
	}
}

