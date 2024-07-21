
import {clone} from "@benev/slate"
import {AgentState, GamePerspective, GameState} from "../state/game.js"

export function extractAgentState(state: GameState, perspective: GamePerspective): AgentState {
	return clone({
		...perspective,
		context: state.context,
	})
}

