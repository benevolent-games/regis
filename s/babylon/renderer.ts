
import {Vec2, Vec3} from "@benev/toolbox"

import {World} from "./world.js"
import {Trashbin} from "../tools/trashbin.js"
import {Tile} from "../machinery/board/data.js"
import {Board} from "../machinery/board/board.js"
import {Units} from "../machinery/units/units.js"
import {AgentState} from "../machinery/game/data.js"
import {Boundaries} from "../machinery/boundaries.js"
import {BlockVariant, ChessGlb} from "./chess-glb.js"
import {Coordinator} from "../machinery/coordinator.js"

export class Renderer {
	board: Board
	units: Units
	boundaries: Boundaries
	coordinator: Coordinator

	constructor(
			public world: World,
			public chessGlb: ChessGlb,
			public state: AgentState,
		) {

		this.units = new Units(state.units)
		this.board = new Board(state.board)

		this.coordinator = new Coordinator({
			blockSize: 2,
			blockHeight: 1,
			board: this.board,
		})

		this.boundaries = new Boundaries(
			this.board,
			this.coordinator,
		)
	}

	#trashbin = new Trashbin()

	#spawnBlock(tile: Tile, place: Vec2, elevationOverride: number) {
		const variant: BlockVariant = "normal"
		const instance = this.#trashbin.disposable(
			tile.ramp
				? this.chessGlb.ramp(elevationOverride, variant)
				: this.chessGlb.block(elevationOverride, variant)
		)
		const position = this.coordinator.toPosition(place)
		instance.position.set(...position)
	}

	#spawnUnit(tile: Tile, place: Vec3) {}

	render() {
		for (const {tile, place} of this.board.loop()) {
			this.#spawnBlock(tile, place, tile.elevation)

			// spawn blocks underneath
			if (tile.elevation > 1)
				this.#spawnBlock(tile, place, 1)

			if (tile.elevation > 2)
				this.#spawnBlock(tile, place, 2)
		}
	}

	dispose() {
		this.#trashbin.dispose()
	}
}

