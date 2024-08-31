
import {interval} from "@benev/slate"

import {randomMap} from "../map-pool.js"
import {Arbiter} from "../logic/arbiter.js"
import {printReport} from "./utils/print-report.js"
import {makeGameTerminal} from "../terminal/terminal.js"
import {TimeDisplay} from "../dom/utils/time-display.js"
import {ChessTimer} from "../logic/utilities/chess-timer.js"
import {TurnTracker} from "../logic/simulation/aspects/turn-tracker.js"

export async function freeplayFlow() {
	const arbiter = new Arbiter({map: randomMap()})
	const agent = arbiter.makeAgent(0)
	const turnTracker = new TurnTracker(agent, agent.activeTeamIndex)
	const {config} = arbiter.state.initial

	const timer = new ChessTimer(config.time, config.teams.length)
	const timeDisplay = new TimeDisplay()
	const updateTimeDisplay = () => timeDisplay.update(
		timer.report(),
		agent.activeTeamIndex,
		agent.activeTeamIndex,
	)

	const stopTicker = interval(1000, updateTimeDisplay)

	const terminal = await makeGameTerminal(
		agent,
		turnTracker,
		turn => arbiter.submitTurn({turn, gameTime: timer.gameTime}),
	)

	arbiter.statesRef.on(states => {
		const teamIndex = arbiter.agent.activeTeamIndex
		agent.state = states.agents.at(teamIndex)!
		turnTracker.teamIndex = teamIndex
		timer.team = teamIndex
		updateTimeDisplay()

		printReport(agent, teamIndex)
		terminal.render()
	})

	printReport(agent, agent.activeTeamIndex)

	return {
		world: terminal.world,
		timeDisplay,
		dispose() {
			terminal.dispose()
			stopTicker()
		},
	}
}

