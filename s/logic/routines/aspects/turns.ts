
import {scalar} from "@benev/toolbox"
import {ArbiterState} from "../../state.js"

export function nextTurn(state: ArbiterState) {
	state.context.currentTurn = scalar.wrap(
		state.context.currentTurn + 1,
		0,
		state.initial.teams.length - 1,
	)
}

