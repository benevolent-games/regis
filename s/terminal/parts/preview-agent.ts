
import {clone} from "@benev/slate"
import {Agent} from "../../logic/agent.js"

export function setupPreviewAgent(baseAgent: Agent, onReset: () => void) {
	const getBaseState = () => clone(baseAgent.state)
	const agent = new Agent(getBaseState())

	function reset() {
		agent.state = getBaseState()
		onReset()
	}

	const dispose = baseAgent.onStateChange(reset)
	return {agent, reset, dispose}
}

