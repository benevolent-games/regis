
import {interval} from "@benev/slate"

import {Agent} from "../logic/agent.js"
import {Arbiter} from "../logic/arbiter.js"
import {AgentState} from "../logic/state.js"
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
	const dynamicAgent = new Agent<AgentState>(arbiter.state)

	// boot up various crap
	const turnTracker = new TurnTracker(dynamicAgent, dynamicAgent.activeTeamId)
	const {config} = arbiter.state.initial
	const timer = new ChessTimer(config.time, config.teams.length)
	const timeDisplay = new TimeDisplay()
	const updateTimeDisplay = () => timeDisplay.update(
		timer.report(),
		dynamicAgent.activeTeamId,
		dynamicAgent.activeTeamId,
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
		const teamId = arbiter.activeTeamId

		// swap out the dynamic agent's state for the current player's
		dynamicAgent.state = arbiter.teamAgent(teamId).state

		// update stuff about the turn change
		turnTracker.teamId = teamId
		timer.team = teamId

		// render ui
		updateTimeDisplay()
		printReport(dynamicAgent, teamId)

		// render 3d stuff
		terminal.render()
	})

	// print initial report
	printReport(dynamicAgent, dynamicAgent.activeTeamId)

	return {
		timeDisplay,
		world: terminal.world,
		dispose() {
			terminal.dispose()
			stopTicker()
		},
	}
}

