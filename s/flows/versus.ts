
import {Trashbin} from "@benev/slate"

import {Agent} from "../logic/agent.js"
import {Connectivity} from "../net/connectivity.js"
import {makeGameTerminal} from "../terminal/terminal.js"
import {GameStartData} from "../director/apis/clientside.js"

export async function versusFlow({
		data,
		connectivity,
		exit,
	}: {
		data: GameStartData
		connectivity: Connectivity
		exit: () => void
	}) {

	const trashbin = new Trashbin()
	const dr = trashbin.disposer

	const agent = new Agent(data.agentState)
	const connection = connectivity.connection.payload

	console.log("versus", data)

	if (!connection) {
		exit()
		return null
	}

	dr(connectivity.onDisconnected(() => {
		console.log("versus received disconnect")
		exit()
	}))

	dr(connectivity.machinery.onGameStart((data) => {
		console.log("versus got CONFUSING onGameStart", data)
	}))

	dr(connectivity.machinery.onGameUpdate(data => {
		console.log("game update!")
		agent.state = data.agentState
	}))

	dr(connectivity.machinery.onGameEnd(() => {
		console.log("versus got onGameEnd")
		exit()
	}))

	const terminal = await makeGameTerminal(
		agent,
		turn => connectivity
			.connection.payload?.serverside
			.game.submitTurn(turn)
	)

	return {
		world: terminal.world,
		dispose() {
			terminal.dispose()
			trashbin.dispose()
		},
	}
}

