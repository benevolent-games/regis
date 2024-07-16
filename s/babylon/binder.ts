
import {ChessGlb} from "./chess-glb.js"
import {makeRenderer} from "./renderer.js"
import {Board} from "../machinery/board/board.js"
import {Units} from "../machinery/units/units.js"
import {AgentState} from "../machinery/game/data.js"
import {Boundaries} from "../machinery/boundaries.js"
import {Coordinator} from "../machinery/coordinator.js"

export function makeBinder(chessGlb: ChessGlb, state: AgentState) {
	const board = new Board(state.board)
	const units = new Units(state.units)
	const coordinator = new Coordinator({board, blockSize: 2, blockHeight: 1})
	const boundaries = new Boundaries(board, coordinator)

	const {render, dispose} = makeRenderer(chessGlb)
	render(state)

	return {
		board,
		units,
		boundaries,
		coordinator,
		dispose,
		updateState(s: AgentState) {
			state = s
			board.state = s.board
			units.state = s.units
			render(s)
		},
	}
}

