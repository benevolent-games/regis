
import {AgentState, GamePerspective, GameState} from "../state/game.js"

export function extractAgentState(state: GameState, perspective: GamePerspective): AgentState {
	return {
		...perspective,
		context: state.context,
	}
}

