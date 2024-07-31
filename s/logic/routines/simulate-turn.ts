
import {Agent} from "../agent.js"
import {propose} from "./aspects/propose.js"
import {AgentState, Choice} from "../state.js"

export function simulateTurn(state: AgentState, turn: {choices: Choice.Any[]}) {
	const agent = new Agent(state)
	const choices = propose(agent)

	for (const choice of turn.choices)
		choices[choice.kind](choice as any)?.commit()
}

