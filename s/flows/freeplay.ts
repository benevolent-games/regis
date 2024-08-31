
import {interval} from "@benev/slate"

import {Agent} from "../logic/agent.js"
import {Arbiter} from "../logic/arbiter.js"
import {printReport} from "./utils/print-report.js"
import {asciiMap} from "../logic/ascii/ascii-map.js"
import {makeGameTerminal} from "../terminal/terminal.js"
import {TimeDisplay} from "../dom/utils/time-display.js"
import {randomMap} from "../logic/routines/map-access.js"
import {ChessTimer} from "../logic/utilities/chess-timer.js"
import {TurnTracker} from "../logic/simulation/aspects/turn-tracker.js"

export async function freeplayFlow() {
	const arbiter = new Arbiter(asciiMap(randomMap()))

	// special agent,
	// which we pass around the freeplay flow,
	// where we manually swap out its state each turn,
	// literally changing which team's perspective it represents.
	const dynamicAgent = new Agent(arbiter.state)

	// boot up various crap
	const turnTracker = new TurnTracker(dynamicAgent, dynamicAgent.activeTeamIndex)
	const {config} = arbiter.state.initial
	const timer = new ChessTimer(config.time, config.teams.length)
	const timeDisplay = new TimeDisplay()
	const updateTimeDisplay = () => timeDisplay.update(
		timer.report(),
		dynamicAgent.activeTeamIndex,
		dynamicAgent.activeTeamIndex,
	)
	const stopTicker = interval(1000, updateTimeDisplay)

	// 3d rendering
	const terminal = await makeGameTerminal(
		dynamicAgent,
		turnTracker,
		turn => arbiter.submitTurn({turn, gameTime: timer.gameTime}),
	)

	arbiter.onStateChange(() => {

		// figure out who's turn it is
		const teamIndex = arbiter.agent.activeTeamIndex

		// swap out the dynamic agent's state for the current player's
		dynamicAgent.state = arbiter.teamAgent(teamIndex).state

		// update stuff about the turn change
		turnTracker.teamIndex = teamIndex
		timer.team = teamIndex

		// render ui
		updateTimeDisplay()
		printReport(dynamicAgent, teamIndex)

		// render 3d stuff
		terminal.render()
	})

	// print initial report
	printReport(dynamicAgent, dynamicAgent.activeTeamIndex)

	return {
		timeDisplay,
		world: terminal.world,
		dispose() {
			terminal.dispose()
			stopTicker()
		},
	}
}

