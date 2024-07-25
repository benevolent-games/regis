
import {clone} from "@benev/slate"

import {Agent} from "../agent.js"
import {purchase} from "./aspects/money.js"
import {nextTurn} from "./aspects/turns.js"
import {visionForTeam} from "./aspects/vision.js"
import {isValidSpawnPlace} from "./aspects/spawning.js"
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
			roster: team.roster,
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
			for (const spawn of incident.spawns) {
				const {unitKind, place} = spawn
				const validPlace = isValidSpawnPlace(agent, teamId, place)
				const {cost} = state.initial.config.unitArchetypes[unitKind]

				if (!validPlace)
					throw new Error(`invalid spawnpoint`)

				if (!cost)
					throw new Error(`unit kind "${unitKind}" has null cost`)

				purchase(state, teamId, cost)
			}

			// attacks
			for (const attack of incident.attacks) {}

			// movements
			for (const movement of incident.movements) {}

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

