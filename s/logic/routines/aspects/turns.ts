
import {ArbiterState} from "../../state.js"

export function nextTurn(state: ArbiterState) {
	state.context.currentTurn += 1
	if (state.context.currentTurn > (state.initial.teams.length - 1))
		state.context.currentTurn = 0
}

