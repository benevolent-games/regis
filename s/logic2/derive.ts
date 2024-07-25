
import {clone} from "@benev/slate"
import {AgentState, ArbiterState} from "./state.js"

export function deriveAgentState(original: ArbiterState, teamId: number): AgentState {
	const arbiterState = clone(original)

	const vision = visionForTeam(arbiterState, teamId)

	return {
		board: arbiterState.board,
		context: arbiterState.context,
		units: censorUnits(arbiterState.units, vision),
		teams: arbiterState.teams.map((team, id) => id === teamId ? team : censorTeam(team)),
	}
}

