
import {Trashbin} from "@benev/slate"
import {Agent} from "../logic/agent.js"
import {Arbiter} from "../logic/arbiter.js"
import {AgentState} from "../logic/state.js"
import {Bridge} from "../dom/utils/bridge.js"
import {printReport} from "./utils/print-report.js"
import {asciiMap} from "../logic/ascii/ascii-map.js"
import {randomMap} from "../config/game/map-access.js"
import {makeGameTerminal} from "../terminal/terminal.js"
import {ChessTimer} from "../tools/chess-timer/chess-timer.js"
import {TurnTracker} from "../logic/simulation/aspects/turn-tracker.js"
import {requestAnimationFrameLoop} from "../tools/request-animation-frame-loop.js"

export async function freeplayFlow() {
	const trash = new Trashbin()
	const [d, dr] = [trash.disposer, trash.disposable]

	const initial = asciiMap(randomMap())
	initial.config.time = undefined

	const arbiter = new Arbiter(initial)

	// special agent,
	// which we pass around the freeplay flow,
	// where we manually swap out its state each turn,
	// literally changing which team's perspective it represents.
	const dynamicAgent = new Agent<AgentState>(arbiter.state)

	// boot up various crap
	const turnTracker = new TurnTracker(dynamicAgent, dynamicAgent.activeTeamId)
	const {config} = arbiter.state.initial
	const timer = new ChessTimer(config.time, config.teams.length)

	// 3d rendering
	const terminal = dr(await makeGameTerminal(
		dynamicAgent,
		turnTracker,
		turn => arbiter.commit({
			kind: "turn",
			turn,
			gameTime: timer.report().gameTime,
		}),
	))

	// data that gets sent to the ui
	const bridge = new Bridge({
		terminal,
		getTimeReport: () => timer.report(),
		getTeamId: () => terminal.previewAgent.activeTeamId,
		surrender: async() => {
			arbiter.commit({
				kind: "surrender",
				gameTime: timer.report().gameTime,
				eliminatedTeamId: turnTracker.teamId,
			})
		},
	})
	d(requestAnimationFrameLoop(bridge.updateTime))

	// update things when the arbiter state changes
	arbiter.onStateChange(() => {

		// figure out who's turn it is
		const teamId = arbiter.activeTeamId

		// swap out the dynamic agent's state for the current player's
		dynamicAgent.state = arbiter.teamAgent(teamId).state

		// update stuff about the turn change
		turnTracker.teamId = teamId
		timer.team = teamId

		// print report to console
		printReport(dynamicAgent, teamId)

		// render 3d stuff
		terminal.render()
	})

	// print initial report
	printReport(dynamicAgent, dynamicAgent.activeTeamId)

	return {
		bridge,
		world: terminal.world,
		dispose: () => trash.dispose(),
	}
}

