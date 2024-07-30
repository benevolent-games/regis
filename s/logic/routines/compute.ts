
import {clone} from "@benev/slate"

import {applyTurn} from "./patch.js"
import {nextTurn} from "./aspects/turns.js"
import {visionForTeam} from "./aspects/vision.js"
import {censorTeam, censorUnits} from "./aspects/censorship.js"
import {ArbiterState, FullTeamInfo, GameHistory, GameStates} from "../state.js"

/**
 * compute the state of the game.
 *
 * we're using an "event sourcing" approach,
 * where given the initial conditions, and a sequence of historical events,
 * we can compute the state of the game.
 *
 * so, to orchestrate a game-in-progress,
 * for each turn, we add a historical event -- then we simply recompute the
 * game state again.
 */
export function compute(original: GameHistory): GameStates {
	const {initial, chronicle} = clone(original)

	// establish the authoritative state for the game,
	// the arbiter "knows all"
	const state: ArbiterState = {
		initial,
		units: initial.units,
		context: {
			currentTurn: 0,
			winner: null,
		},
		teams: initial.teams.map((team): FullTeamInfo => ({
			name: team.name,
			resources: initial.config.startingResources,
			investments: [],
		})),
		reminders: {
			choices: [],
			kills: [],
		},
	}

	// we churn through every event in the game history,
	// updating the arbiter state as we go along
	for (const incident of chronicle) {

		// process a turn
		if (incident.kind === "turn") {
			applyTurn(state, incident)
			nextTurn(state)
		}

		// the game has ended
		else if (incident.kind === "conclusion")
			state.context.winner = incident

		else
			throw new Error(`unknown incident kind`)
	}

	// finally, we return the final result states
	return {
		arbiter: state,
		agents: state.teams.map((_, teamId) => {
			const vision = visionForTeam(state, teamId)
			return clone({
				initial: state.initial,
				context: state.context,
				units: censorUnits(state.units, vision),
				teams: state.teams.map((team, id) => id === teamId ? team : censorTeam(team)),
				reminders: {
					choices: [],
					kills: [],
				},
			})
		}),
	}
}

