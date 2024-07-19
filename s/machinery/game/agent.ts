
import {AgentState} from "./data.js"
import {Boundaries} from "../boundaries.js"
import {Coordinator} from "../coordinator.js"
import {BoardReader} from "../board/reader.js"
import {UnitsReader} from "../units/reader.js"

export class Agent {
	board: BoardReader
	units: UnitsReader
	coordinator: Coordinator
	boundaries: Boundaries

	constructor(public getState: () => AgentState) {
		this.board = new BoardReader(() => getState().board)
		this.units = new UnitsReader(() => getState().units)
		this.coordinator = new Coordinator({board: this.board, blockSize: 2, blockHeight: 1})
		this.boundaries = new Boundaries(this.board, this.coordinator)
	}
}

