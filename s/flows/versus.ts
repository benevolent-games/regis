
import {Trashbin} from "@benev/slate"

import {Bridge} from "../dom/utils/bridge.js"
import {GameSession} from "../net/game-session.js"
import {printReport} from "./utils/print-report.js"
import {Connectivity} from "../net/connectivity.js"
import {makeGameTerminal} from "../terminal/terminal.js"
import {TurnTracker} from "../logic/simulation/aspects/turn-tracker.js"
import {requestAnimationFrameLoop} from "../tools/request-animation-frame-loop.js"

export async function versusFlow({
		gameSession,
		connectivity,
		exit,
	}: {
		gameSession: GameSession
		connectivity: Connectivity
		exit: () => void
	}) {

	const trash = new Trashbin()
	const [d, dr] = [trash.disposer, trash.disposable]

	const teamId = gameSession.memo.teamId
	const agent = gameSession.agent
	const connection = connectivity.connection.payload
	const turnTracker = new TurnTracker(agent, teamId)

	const terminal = dr(await makeGameTerminal(
		agent,
		turnTracker,
		turn => connectivity
			.connection.payload?.serverside
			.game.submitTurn(turn),
	))

	// data that gets sent to the ui
	const bridge = dr(new Bridge({
		terminal,
		getTeamId: () => teamId,
		getTimeReport: () => {
			return gameSession.timerObserver
				? gameSession.timerObserver.report(agent.activeTeamId)
				: gameSession.pregameTimer.report()
		},
		surrender: async() => {
			if (!agent.conclusion && connection)
				await connection.serverside.game.surrender()
		},
	}))
	d(requestAnimationFrameLoop(bridge.updateTime))
	printReport(agent, teamId)

	if (!connection) {
		exit()
		return null
	}

	d(connectivity.onDisconnected(() => {
		console.log("connection failed while in-game :(")
		exit()
	}))

	return {
		bridge,
		world: terminal.world,
		dispose: () => trash.dispose(),
	}
}

