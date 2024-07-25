
import {AgentState} from "../state.js"
import {TilesHelper} from "./tiles.js"
import {UnitsHelper} from "./units.js"
import {BoundaryHelper} from "./boundary.js"
import {CoordinatorHelper} from "./coordinator.js"

export class Agent {
	constructor(public state: AgentState) {}
	get boundary() { return new BoundaryHelper(this.state.initial.board) }
	get coordinator() { return new CoordinatorHelper(this.state.initial.board) }
	get tiles() { return new TilesHelper(this.state.initial.board) }
	get units() { return new UnitsHelper(this.state.units) }
}

