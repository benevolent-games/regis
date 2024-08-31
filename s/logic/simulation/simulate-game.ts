
import {GameHistory, GameStates} from "../state.js"
import {simulateTurn} from "./simulants/simulate-turn.js"
import {finalizeGameStates} from "./simulants/finalize-game-states.js"
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
export function simulateGame({initial, chronicle}: GameHistory): GameStates {
	const state = initializeArbiterState(initial)

	// churn through game history
	for (const {turn} of chronicle) {

		// simulate each turn, updating the state
		const gameOver = simulateTurn(state, turn)

		// if the game is over, abandon further simulation
		if (gameOver)
			break
	}

	// compute new states for each player's own perspective
	return finalizeGameStates(state, chronicle)
}

