
import {AgentState} from "./state/game.js"
import {BoardHelper} from "./helpers/board.js"
import {UnitsHelper} from "./helpers/units.js"
import {BoundaryHelper} from "./helpers/boundary.js"
import {CoordinatorHelper} from "./helpers/coordinator.js"

export class Detective {
	constructor(public getState: () => AgentState) {}
	get state() { return this.getState() }
	get board() { return new BoardHelper(this.state.board) }
	get units() { return new UnitsHelper(this.state.units) }
	get boundary() { return new BoundaryHelper(this.state.board) }
	get coordinator() { return new CoordinatorHelper(this.state.board) }
}

