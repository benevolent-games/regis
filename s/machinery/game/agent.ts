
import {AgentState} from "./data.js"
import {Board} from "../board/board.js"
import {Boundaries} from "../boundaries.js"
import {Coordinator} from "../coordinator.js"
import {UnitsReader} from "../units/units.js"

export class Agent {
	board: Board
	units: UnitsReader
	coordinator: Coordinator
	boundaries: Boundaries

	constructor(public getState: () => AgentState) {
		this.board = new Board(() => getState().board)
		this.units = new UnitsReader(() => getState().units)
		this.coordinator = new Coordinator({board: this.board, blockSize: 2, blockHeight: 1})
		this.boundaries = new Boundaries(this.board, this.coordinator)
	}
}

