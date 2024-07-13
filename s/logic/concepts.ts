
import {pubsub} from "@benev/slate"
import {id_counter, loop2d, scalar, vec2, Vec2} from "@benev/toolbox"

// /** location coordinates for a spot on the chess board */
// export class Place {
// 	static coords(file: number, rank: number) {
// 		return new this([file, rank])
// 	}
//
// 	static at({rank, file}: {rank: number, file: number}) {
// 		return new this([file, rank])
// 	}
//
// 	/** corresponds to worldZ */
// 	rank = 0
//
// 	/** corresponds to worldX */
// 	file = 0
//
// 	constructor([file, rank]: Vec2 = [0, 0]) {
// 		this.rank = rank
// 		this.file = file
// 	}
//
// 	get vector(): Vec2 {
// 		return [this.file, this.rank]
// 	}
//
// 	same({rank, file}: Place) {
// 		return (
// 			rank === this.rank &&
// 			file === this.file
// 		)
// 	}
// }

export type Elevation = 1 | 2 | 3
export type Ramp = "north" | "east" | "south" | "west"

/** information about a tile on the board */
export class Tile {
	elevation: Elevation = 1
	resource = false
	watchTower = false
	ramp: Ramp | null = null
}

/** data structure to hold all tiles on the board */
export class Grid {
	extent: Vec2 = [8, 8]
	#array = [...loop2d(this.extent)].map(() => new Tile())

	#valid([file, rank]: Vec2) {
		return (
			scalar.within(file, 0, this.extent[0] - 1) &&
			scalar.within(rank, 0, this.extent[1] - 1)
		)
	}

	at(place: Vec2) {
		const [file, rank] = place
		if (!this.#valid(place))
			throw new Error(`invalid ascii map, rank ${rank}x${file} is not on the grid`)
		const index = (rank * this.extent[0]) + file
		const tile = this.#array[index]
		if (!tile) throw new Error(`tile not found`)
		return tile
	}

	;*loop() {
		for (const place of loop2d(this.extent)) {
			yield {place, tile: this.at(place)}
		}
	}
}

export type Team = (
	| 0 // neutral
	| 1 // white
	| 2 // black
)

export type UnitKind = (
	| "obstacle"
	| "king"
	| "queen"
	| "bishop"
	| "knight"
	| "rook"
	| "pawn"
)

export type UnitArchetype = {
	health: number | null
	vision: null | {
		range: number
		seeUpCliffs: boolean
		seeDownCliffs: boolean
	}
	attack: null | {
		kind: "melee" | "ranged"
		range: number
	}
	caps: null | {
		general: number | null
		move: number | null
		attack: number | null
	}
}

export type Unit = {
	kind: UnitKind
	team: Team
	place: Vec2
	damage: number
}

export class Units {
	#id = id_counter()
	#data = new Map<number, Unit>()

	get(id: number) {
		const unit = this.#data.get(id)
		if (!unit) throw new Error(`unknown unit ${id}`)
		return unit
	}

	at(place: Vec2) {
		for (const [id, unit] of this.#data)
			if (vec2.equal(place, unit.place))
				return {id, unit}
	}

	add(unit: Unit) {
		const id = this.#id()
		if (this.#data.has(id)) throw new Error(`unit already exists ${id}`)
		this.#data.set(id, unit)
		return id
	}

	delete(id: number) {
		this.#data.delete(id)
	}

	;*list(team: Team | null = null) {
		for (const [id, unit] of this.#data)
			if (team === null || unit.team === team)
				yield {id, unit}
	}
}

