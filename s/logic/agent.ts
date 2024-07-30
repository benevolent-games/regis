
import {ref, Ref} from "../tools/ref.js"
import {TilesHelper} from "./helpers/tiles.js"
import {UnitsHelper} from "./helpers/units.js"
import {BoundaryHelper} from "./helpers/boundary.js"
import {CoordinatorHelper} from "./helpers/coordinator.js"
import {AgentState, FullTeamInfo, UnitKind} from "./state.js"

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

	archetype(unitKind: UnitKind) {
		return this.state.initial.config.unitArchetypes[unitKind]
	}

	get fullTeams() {
		const teams: {teamId: number, team: FullTeamInfo}[] = []
		this.state.teams.forEach((team, teamId) => {
			if ("resources" in team)
				teams.push({teamId, team})
		})
		return teams
	}
}

