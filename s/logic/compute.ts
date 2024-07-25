
import {clone} from "@benev/slate"
import {deriveAgentState} from "./derive.js"
import {ArbiterState, FullTeamInfo, GameHistory, GameStates} from "./state.js"

export function compute(original: GameHistory): GameStates {
	const {initial, chronicle} = clone(original)

	const state: ArbiterState = {
		initial,
		units: initial.units,
		context: {
			currentTurn: 0,
			winner: null,
		},
		teams: initial.teams.map((team): FullTeamInfo => ({
			name: team.name,
			roster: team.roster,
			resources: initial.config.startingResources,
			investments: [],
		})),
	}

	for (const incident of chronicle) {
		if (incident.kind === "turn") {
			for (const spawn of incident.spawns) {}
			for (const attack of incident.attacks) {}
			for (const movement of incident.movements) {}
			for (const investment of incident.investments) {}
		}
		else if (incident.kind === "conclusion") {
			state.context.winner = incident
		}
		else {
			throw new Error(`unknown incident kind`)
		}
	}

	return {
		arbiter: state,
		agents: initial
			.teams
			.map((_, teamId) => deriveAgentState(state, teamId)),
	}
}

