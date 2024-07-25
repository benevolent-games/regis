
import {AgentState, UnitKind} from "./state.js"
import {TilesHelper} from "./helpers/tiles.js"
import {UnitsHelper} from "./helpers/units.js"
import {BoundaryHelper} from "./helpers/boundary.js"
import {CoordinatorHelper} from "./helpers/coordinator.js"

export class Agent {
	constructor(public state: AgentState) {}

	get boundary() { return new BoundaryHelper(this.state.initial.board) }
	get coordinator() { return new CoordinatorHelper(this.state.initial.board) }
	get tiles() { return new TilesHelper(this.state.initial.board) }
	get units() { return new UnitsHelper(this.state.units) }

	archetype(unitKind: UnitKind) {
		return this.state.initial.config.unitArchetypes[unitKind]
	}
}

