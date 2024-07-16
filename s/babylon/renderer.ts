
import {Vec2, Vec3} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core"

import {World} from "./world.js"
import {ChessGlb} from "./chess-glb.js"
import {Trashbin} from "../tools/trashbin.js"
import {Tile} from "../machinery/board/data.js"
import {Board} from "../machinery/board/board.js"
import {Units} from "../machinery/units/units.js"
import {AgentState} from "../machinery/game/data.js"
import {Boundaries} from "../machinery/boundaries.js"
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

	#spawnBlock(place: Vec2, layer: number) {
		const block = this.#trashbin.disposable(
			this.chessGlb.block(layer, "normal")
		)
		this.#positionBlock(block, place, layer)
		return block
	}

	#spawnStep(place: Vec2, layer: number) {
		const step = this.#trashbin.disposable(
			this.chessGlb.step(layer, "normal")
		)
		this.#positionBlock(step, place, layer)
		return step
	}

	#positionBlock(instance: TransformNode, place: Vec2, elevation: number) {
		const y = elevation
		const [x,,z] = this.coordinator.toPosition(place)
		instance.position.set(x, y, z)
	}

	#spawnUnit(tile: Tile, place: Vec3) {}

	render() {
		for (const {tile, place} of this.board.loop()) {
			if (tile.step)
				this.#spawnStep(place, tile.elevation)
			else
				this.#spawnBlock(place, tile.elevation)

			// spawn blocks underneath
			if (tile.elevation > 1)
				this.#spawnBlock(place, 1)

			if (tile.elevation > 2)
				this.#spawnBlock(place, 2)
		}
	}

	dispose() {
		this.#trashbin.dispose()
	}
}

