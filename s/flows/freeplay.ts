
import {randomMap} from "../map-pool.js"
import {Arbiter} from "../logic/arbiter.js"
import {printReport} from "./utils/print-report.js"
import {makeGameTerminal} from "../terminal/terminal.js"

export async function freeplayFlow() {
	const arbiter = new Arbiter(randomMap().ascii)
	const agent = arbiter.makeAgent(null)

	const terminal = await makeGameTerminal(agent, [0, 1], arbiter.submitTurn)

	arbiter.statesRef.on(states => {
		agent.state = states.agents.at(states.arbiter.context.currentTurn)!
		printReport(agent, agent.currentTurn)
		terminal.render()
	})

	printReport(agent, agent.currentTurn)

	return {
		world: terminal.world,
		dispose() {
			terminal.dispose()
		},
	}
}

