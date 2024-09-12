
import {Trashbin} from "@benev/slate"

import {Agent} from "../logic/agent.js"
import {Bridge} from "../dom/utils/bridge.js"
import {printReport} from "./utils/print-report.js"
import {Connectivity} from "../net/connectivity.js"
import {makeGameTerminal} from "../terminal/terminal.js"
import {StartMemo} from "../director/apis/clientside.js"
import {TimerObserver} from "../tools/chess-timer/timer-observer.js"
import {TurnTracker} from "../logic/simulation/aspects/turn-tracker.js"
import {requestAnimationFrameLoop} from "../tools/request-animation-frame-loop.js"

export async function versusFlow({
		data: startData,
		connectivity,
		exit,
	}: {
		data: StartMemo
		connectivity: Connectivity
		exit: () => void
	}) {

	const trash = new Trashbin()
	const [d, dr] = [trash.disposer, trash.disposable]

	const teamId = startData.teamId
	const agent = new Agent(startData.agentState)
	const connection = connectivity.connection.payload
	const turnTracker = new TurnTracker(agent, teamId)

	const terminal = dr(await makeGameTerminal(
		agent,
		turnTracker,
		turn => connectivity
			.connection.payload?.serverside
			.game.submitTurn(turn),
	))

	const timerObserver = new TimerObserver(
		agent.state.initial.config.time,
		startData.timeReport,
	)

	// data that gets sent to the ui
	const bridge = dr(new Bridge({
		terminal,
		getTeamId: () => teamId,
		getTimeReport: () => timerObserver.report(agent.activeTeamId),
		surrender: async() => {
			await connectivity.connection.payload?.serverside.game.surrender()
		},
	}))
	d(requestAnimationFrameLoop(bridge.updateTime))
	printReport(agent, teamId)

	if (!connection) {
		exit()
		return null
	}

	d(connectivity.onDisconnected(() => {
		console.log("versus received disconnect")
		exit()
	}))

	d(connectivity.machinery.onGameStart((data) => {
		console.log("versus got CONFUSING onGameStart", data)
	}))

	d(connectivity.machinery.onGameUpdate(data => {
		agent.state = data.agentState
		timerObserver.update(data.timeReport)
		printReport(agent, teamId)
	}))

	d(connectivity.machinery.onGameEnd(() => {
		console.log("versus got onGameEnd")
		exit()
	}))

	return {
		bridge,
		world: terminal.world,
		dispose: () => trash.dispose(),
	}
}

