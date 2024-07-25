
import {clone} from "@benev/slate"
import {Vec2} from "@benev/toolbox"
import {AgentState, ArbiterState, FullTeamInfo, LimitedTeamInfo, Unit} from "./state.js"

export function deriveAgentState(original: ArbiterState, teamId: number): AgentState {
	const arbiterState = clone(original)
	const vision = visionForTeam(arbiterState, teamId)

	return {
		initial: arbiterState.initial,
		context: arbiterState.context,
		units: censorUnits(arbiterState.units, vision),
		teams: arbiterState.teams.map((team, id) => id === teamId ? team : censorTeam(team)),
	}
}

function visionForTeam(state: ArbiterState, teamId: number) {
	return []
}

function censorUnits(units: Unit[], vision: Vec2[]) {
	return units
}

function censorTeam(team: FullTeamInfo): LimitedTeamInfo {
	return {
		name: team.name,

		// hmm...
		// the agent should "remember" the last-seen investment status of a resource claim...
		// however, the current system design is stateless and cannot provide this..
		investments: [],
	}
}

