
import {clone} from "@benev/slate"
import {Agent} from "../../logic/agent.js"

export function setupPreviewAgent(baseAgent: Agent, onReset: () => void) {
	const agent = new Agent(clone(baseAgent.state))
	const dispose = baseAgent.stateRef.on(reset)

	function reset() {
		agent.state = clone(baseAgent.state)
		onReset()
	}

	return {agent, reset, dispose}
}

