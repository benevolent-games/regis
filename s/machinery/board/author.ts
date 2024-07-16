
import {loop2d, Vec2} from "@benev/toolbox"
import {Tile} from "./data.js"
import {Board} from "./board.js"

export class BoardAuthor extends Board {
	constructor() {
		const extent: Vec2 = [8, 8]
		const tiles = [...loop2d(extent)].map((): Tile => ({
			ramp: false,
			elevation: 1,
			resource: false,
			watchTower: false,
		}))
		super({extent, tiles})
	}
}

