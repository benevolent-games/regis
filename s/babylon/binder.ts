
import {ChessGlb} from "./chess-glb.js"
import {Trashbin} from "../tools/trashbin.js"
import {Board} from "../machinery/board/board.js"
import {Units} from "../machinery/units/units.js"
import {AgentState} from "../machinery/game/data.js"
import {Boundaries} from "../machinery/boundaries.js"
import {Coordinator} from "../machinery/coordinator.js"
import {makeTileRenderer} from "./rendering/tile-renderer.js"

export function makeBinder(chessGlb: ChessGlb, initialState: AgentState) {
	const trashbin = new Trashbin()
	const board = new Board(initialState.board)
	const units = new Units(initialState.units)
	const coordinator = new Coordinator({board, blockSize: 2, blockHeight: 1})
	const boundaries = new Boundaries(board, coordinator)
	const {renderTile, blockPlacements} = makeTileRenderer(trashbin, chessGlb, coordinator)

	function render() {
		trashbin.dispose()
		blockPlacements.clear()

		for (const {tile, place} of board.loop())
			renderTile(tile, place)
	}

	render()

	return {
		board,
		units,
		boundaries,
		coordinator,
		blockPlacements,
		dispose: trashbin.dispose,
		updateState(s: AgentState) {
			initialState = s
			board.state = s.board
			units.state = s.units
			render()
		},
	}
}

