
import {randomMap} from "../map-pool.js"
import {Arbiter} from "../logic/arbiter.js"
import {printReport} from "./utils/print-report.js"
import {TimeKeeper} from "../logic/levers/timing.js"
import {makeGameTerminal} from "../terminal/terminal.js"
import {TurnTracker} from "../logic/simulation/aspects/turn-tracker.js"
import { interval } from "@benev/slate"

export async function freeplayFlow() {
	const arbiter = new Arbiter({map: randomMap()})
	const agent = arbiter.makeAgent(null)
	const turnTracker = new TurnTracker(agent, agent.activeTeamIndex)

	const timeReferee = new TimeKeeper(arbiter)
	const stopTicker = interval(2000, () => {
		console.log("TIME REPORT", timeReferee.report())
	})

	const terminal = await makeGameTerminal(
		agent,
		turnTracker,
		turn => arbiter.submitTurn({turn, gameTime: timeReferee.gameTime}),
	)

	arbiter.statesRef.on(states => {
		const teamIndex = arbiter.agent.activeTeamIndex
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
			stopTicker()
		},
	}
}

