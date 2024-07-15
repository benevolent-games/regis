
import {World} from "./world.js"
import {ChessGlb} from "./chess-glb.js"
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

	constructor(public world: World, public chessGlb: ChessGlb, public state: AgentState) {
		this.units = new Units(state.units)
		this.board = new Board(state.board)

		this.coordinator = new Coordinator({
			board: this.board,
			blockSize: 2,
			blockHeight: 1,
		})

		this.boundaries = new Boundaries(
			this.board,
			this.coordinator,
		)
	}

	render() {}

	dispose() {}
}

