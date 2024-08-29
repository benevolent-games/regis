
import {randomMap} from "../map-pool.js"
import {Arbiter} from "../logic/arbiter.js"
import {printReport} from "./utils/print-report.js"
import {makeGameTerminal} from "../terminal/terminal.js"
import {TurnTracker} from "../logic/simulation/aspects/turn-tracker.js"

export async function freeplayFlow() {
	const arbiter = new Arbiter(randomMap().ascii)
	const agent = arbiter.makeAgent(null)
	const turnTracker = new TurnTracker(agent, agent.activeTeamIndex)

	const terminal = await makeGameTerminal(
		agent,
		turnTracker,
		arbiter.submitTurn
	)

	arbiter.statesRef.on(states => {
		const teamIndex = arbiter.activeTeamIndex
		agent.state = states.agents.at(teamIndex)!
		turnTracker.teamIndex = teamIndex
		printReport(agent, teamIndex)
		terminal.render()
	})

	printReport(agent, agent.activeTeamIndex)

	return {
		world: terminal.world,
		dispose() {
			terminal.dispose()
		},
	}
}

