
import {GameHistory} from "../state.js"
import {simulateTurn} from "./simulants/simulate-turn.js"
import {applyWinByElimination} from "./aspects/turns.js"
import {initializeArbiterState} from "./simulants/initialize-arbiter-state.js"

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
export function simulateGame({initial, chronicle}: GameHistory) {
	const state = initializeArbiterState(initial)

	for (const entry of chronicle) {
		switch (entry.kind) {

			case "turn":
				simulateTurn(state, entry.turn)
				break

			case "timeExpired":
				applyWinByElimination(state, entry.eliminatedTeamId, "timeExpired")
				break

			case "surrender":
				applyWinByElimination(state, entry.eliminatedTeamId, "timeExpired")
				break

			default:
				throw new Error(`unknown chronicle entry kind`)
		}

		if (state.context.conclusion)
			break
	}

	return state
}

