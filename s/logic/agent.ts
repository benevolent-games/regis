
import {pubsub} from "@benev/slate"

import {TilesHelper} from "./helpers/tiles.js"
import {UnitsHelper} from "./helpers/units.js"
import {AgentState, UnitKind} from "./state.js"
import {ClaimsHelper} from "./helpers/claims.js"
import {BoundaryHelper} from "./helpers/boundary.js"
import {CoordinatorHelper} from "./helpers/coordinator.js"
import {activeTeamIndex} from "./simulation/aspects/turns.js"

export class Agent<State extends AgentState = AgentState> {
	#state: State
	onStateChange = pubsub<[State]>()

	constructor(state: State) {
		this.#state = state
	}

	publishStateChange() {
		this.onStateChange.publish(this.state)
	}

	get state() {
		return this.#state
	}

	set state(state: State) {
		this.#state = state
		this.publishStateChange()
	}

	get boundary() { return new BoundaryHelper(this.state.initial.board) }
	get coordinator() { return new CoordinatorHelper(this.state.initial.board) }
	get tiles() { return new TilesHelper(this.state.initial.board) }
	get units() { return new UnitsHelper(this.state.units) }
	get claims() { return new ClaimsHelper(this.state, this.tiles, this.units) }

	grabId() {
		const id = this.state.context.nextId
		this.state.context.nextId += 1
		return id
	}

	deleteUnit(id: number) {
		this.state.units = this.state.units.filter(unit => unit.id !== id)
		this.publishStateChange()
	}

	archetype(unitKind: UnitKind) {
		return this.state.initial.config.unitArchetypes[unitKind]
	}

	get activeTeam() {
		return this.state.teams.at(this.activeTeamIndex)!
	}

	get activeTeamIndex() {
		return activeTeamIndex(this.state)
	}

	get conclusion() {
		return this.state.context.conclusion
	}
}

