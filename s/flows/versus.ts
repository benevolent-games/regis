
import {Trashbin} from "@benev/slate"

import {Bridge} from "../dom/utils/bridge.js"
import {GameSession} from "../net/game-session.js"
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
		turn => connection?.serverside.game.submitTurn(turn),
		() => gameSession.status,
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
				await connection.serverside.game.submitSurrender()
		},
	}))
	d(requestAnimationFrameLoop(bridge.updateTime))
	// printReport(agent, teamId)

	function kill() {
		trash.dispose()
		exit()
	}

	d(connectivity.onDisconnected(kill))

	if (!connection) {
		kill()
		return null
	}

	return {
		bridge,
		world: terminal.world,
		dispose: () => trash.dispose(),
	}
}

