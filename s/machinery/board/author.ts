
import {loop2d, Vec2} from "@benev/toolbox"

import {Board} from "./board.js"
import {BoardState, Tile} from "./data.js"

export class BoardAuthor {
	state: BoardState = (() => {
		const extent: Vec2 = [8, 8]
		const tiles = [...loop2d(extent)].map((): Tile => ({
			step: false,
			elevation: 1,
			resource: false,
			watchTower: false,
		}))
		return {extent, tiles}
	})()

	read = new Board(() => this.state)
}

