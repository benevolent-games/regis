
import {ChessGlb} from "./chess-glb.js"
import {Trashbin} from "../tools/trashbin.js"
import {Board} from "../machinery/board/board.js"
import {Units} from "../machinery/units/units.js"
import {AgentState} from "../machinery/game/data.js"
import {Boundaries} from "../machinery/boundaries.js"
import {Coordinator} from "../machinery/coordinator.js"
import {makeTileRenderer} from "./rendering/tile-renderer.js"

export type Renderer = ReturnType<typeof makeRenderer>

export function makeRenderer(chessGlb: ChessGlb) {
	const trashbin = new Trashbin()

	function render(state: AgentState) {
		trashbin.dispose()
		const units = new Units(state.units)
		const board = new Board(state.board)
		const coordinator = new Coordinator({board, blockSize: 2, blockHeight: 1})
		const boundaries = new Boundaries(board, coordinator)
		const renderTile = makeTileRenderer(trashbin, chessGlb, coordinator)

		for (const entry of board.loop())
			renderTile(entry)
	}

	function dispose() {
		trashbin.dispose()
	}

	return {render, dispose}
}

