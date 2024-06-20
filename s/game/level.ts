
import {Vec2, loop2d} from "@benev/toolbox"

export type Elevation = (
	| 0 // water
	| 1 // sand
	| 2 // dirt
	| 4 // grass
	| 5 // rock
)

export type Kind = "block" | "corner" | "ramp"

export enum Cardinal {
	North,
	East,
	South,
	West,
}

export enum Ordinal {
	NorthWest,
	NorthEast,
	SouthEast,
	SouthWest,
}

export type Block = {
	kind: "block"
	elevation: Elevation
}

export type Corner = {
	kind: "corner"
	elevation: Elevation
	ordinal: Ordinal
}

export type Ramp = {
	kind: "ramp"
	elevation: Elevation
	cardinal: Cardinal
}

export type Tile = Block | Corner | Ramp

export function asTile<T extends Tile>(tile: T) {
	return tile
}

export class Level {
	readonly extent: Vec2
	#tiles: Tile[]

	constructor(extent: Vec2) {
		this.extent = extent
		this.#tiles = [...loop2d(extent)].map(
			() => asTile({kind: "block", elevation: 0})
		)
	}

	tileIndex([x, y]: Vec2) {
		const [extentX] = this.extent
		return (y * extentX) + x
	}

	getTile(vec: Vec2) {
		return this.#tiles[this.tileIndex(vec)]
	}

	setTile(vec: Vec2, tile: Tile) {
		this.#tiles[this.tileIndex(vec)] = tile
	}

	overwriteTiles(tiles: Tile[]) {
		this.#tiles = tiles
	}

	*loop() {
		for (const vec of loop2d(this.extent)) {
			const tile = this.getTile(vec)
			yield [tile, vec] as [Tile, Vec2]
		}
	}

	save() {
		return JSON.stringify({
			version: 0,
			extent: this.extent,
			tiles: this.#tiles,
		})
	}

	static load(json: string) {
		const {extent, tiles} = JSON.parse(json) as any
		const level = new this(extent)
		level.overwriteTiles(tiles)
		return new this(extent)
	}
}

