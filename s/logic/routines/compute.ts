
import {clone} from "@benev/slate"

import {Agent} from "../agent.js"
import {purchase} from "./aspects/money.js"
import {nextTurn} from "./aspects/turns.js"
import {propose} from "./aspects/propose.js"
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
	}

	// we churn through every event in the game history,
	// updating the arbiter state as we go along
	for (const incident of chronicle) {
		const teamId = state.context.currentTurn
		const agent = new Agent(state)

		// process a new turn
		if (incident.kind === "turn") {

			// spawns
			for (const choice of incident.spawns) {
				const possible = propose(agent).spawn(choice)
				if (possible) {
					purchase(state, teamId, possible.cost)
					agent.units.add({
						kind: choice.unitKind,
						place: choice.place,
						team: teamId,
						damage: 0,
					})
				}
				else throw new Error("invalid spawn")
			}

			// movements
			for (const choice of incident.movements) {
				const possible = propose(agent).movement(choice)
				if (possible) {
					possible.unit.place = choice.target
				}
				else throw new Error("invalid movement")
			}

			// attacks
			for (const attack of incident.attacks) {}

			// investments
			for (const investment of incident.investments) {}

			// switch to next turn
			nextTurn(state)
		}

		// the game has ended
		else if (incident.kind === "conclusion") {
			state.context.winner = incident
		}

		else {
			throw new Error(`unknown incident kind`)
		}
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
			})
		}),
	}
}

