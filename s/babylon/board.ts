
import {Vec2} from "@benev/toolbox"

import {ChessGlb} from "./chess-glb.js"
import {Grid, Tile} from "../logic/concepts.js"
import {Boundaries} from "../machinery/boundaries.js"
import {Coordinator} from "../machinery/coordinator.js"
import {Selectacon} from "../machinery/selectacon.js"

type Options = {
	grid: Grid
	chessGlb: ChessGlb
	selectionSelectacon: Selectacon
}

type Stack = {
	place: Vec2
	tile: Tile
	dispose: () => void
}

export class Board {
	#stacks = new Map()
	boundaries: Boundaries
	coordinator: Coordinator

	constructor(private grid: Grid, private glb: ChessGlb) {
		this.coordinator = new Coordinator({
			grid,
			blockSize: 2,
			blockHeight: 1,
		})
		this.boundaries = new Boundaries(grid, this.coordinator)
	}

	#hoverPlace: Vec2 | null = null

	get hoverPlace() {
		return this.#hoverPlace
	}

	set hoverPlace(place: Vec2 | null) {
		this.#hoverPlace = place
	}


}

