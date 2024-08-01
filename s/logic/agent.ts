
import {ref, Ref} from "../tools/ref.js"
import {TilesHelper} from "./helpers/tiles.js"
import {UnitsHelper} from "./helpers/units.js"
import {AgentState, UnitKind} from "./state.js"
import {BoundaryHelper} from "./helpers/boundary.js"
import {CoordinatorHelper} from "./helpers/coordinator.js"

export class Agent {
	stateRef: Ref<AgentState>

	constructor(state: AgentState) {
		this.stateRef = ref(state)
	}

	get state() {
		return this.stateRef.value
	}

	set state(value: AgentState) {
		this.stateRef.value = value
	}

	get boundary() { return new BoundaryHelper(this.state.initial.board) }
	get coordinator() { return new CoordinatorHelper(this.state.initial.board) }
	get tiles() { return new TilesHelper(this.state.initial.board) }
	get units() { return new UnitsHelper(this.state.units) }

	deleteUnit(id: string) {
		this.state.units = this.state.units.filter(unit => unit.id !== id)
		this.stateRef.publish()
	}

	archetype(unitKind: UnitKind) {
		return this.state.initial.config.unitArchetypes[unitKind]
	}

	get currentTeam() {
		return this.state.teams.at(this.state.context.currentTurn)!
	}

	get currentTurn() {
		return this.state.context.currentTurn
	}
}

