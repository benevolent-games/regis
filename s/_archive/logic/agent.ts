
import {AgentState} from "./state/game.js"
import {BoardHelper} from "./helpers/board.js"
import {UnitsHelper} from "./helpers/units.js"
import {BoundaryHelper} from "./helpers/boundary.js"
import {CoordinatorHelper} from "./helpers/coordinator.js"

/** access to one user's perspective on the state of a game, which may be censored for fog-of-war */
export class Agent {
	constructor(public state: AgentState) {}
	get board() { return new BoardHelper(this.state.board) }
	get units() { return new UnitsHelper(this.state.units) }
	get boundary() { return new BoundaryHelper(this.state.board) }
	get coordinator() { return new CoordinatorHelper(this.state.board) }
}

