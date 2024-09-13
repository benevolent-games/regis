
import {Trashbin} from "@benev/slate"

import {Agent} from "../logic/agent.js"
import {Bridge} from "../dom/utils/bridge.js"
import {printReport} from "./utils/print-report.js"
import {Connectivity} from "../net/connectivity.js"
import {makeGameTerminal} from "../terminal/terminal.js"
import {InitialMemo} from "../director/apis/clientside.js"
import {TimerObserver} from "../tools/chess-timer/timer-observer.js"
import {TurnTracker} from "../logic/simulation/aspects/turn-tracker.js"
import {requestAnimationFrameLoop} from "../tools/request-animation-frame-loop.js"
import { PregameTimer } from "../net/pregame-timer.js"

export async function versusFlow({
		initialMemo,
		connectivity,
		pregameTimer,
		exit,
	}: {
		initialMemo: InitialMemo
		connectivity: Connectivity
		pregameTimer: PregameTimer
		exit: () => void
	}) {

	const trash = new Trashbin()
	const [d, dr] = [trash.disposer, trash.disposable]

	const teamId = initialMemo.teamId
	const agent = new Agent(initialMemo.agentState)
	const connection = connectivity.connection.payload
	const turnTracker = new TurnTracker(agent, teamId)

	const terminal = dr(await makeGameTerminal(
		agent,
		turnTracker,
		turn => connectivity
			.connection.payload?.serverside
			.game.submitTurn(turn),
	))

	let timerObserver: TimerObserver | null = null

	// data that gets sent to the ui
	const bridge = dr(new Bridge({
		terminal,
		getTeamId: () => teamId,
		getTimeReport: () => {
			return timerObserver
				? timerObserver.report(agent.activeTeamId)
				: pregameTimer.report()
		},
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

	d(connectivity.machinery.onGameStart(memo => {
		console.log("ON GAME START", memo)
		timerObserver = new TimerObserver(
			agent.state.initial.config.time,
			memo.timeReport,
		)
	}))

	d(connectivity.machinery.onGameUpdate(memo => {
		agent.state = memo.agentState
		if (timerObserver)
			timerObserver.update(memo.timeReport)
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

