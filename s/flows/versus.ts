
import {Trashbin} from "@benev/slate"

import {Agent} from "../logic/agent.js"
import {Connectivity} from "../net/connectivity.js"
import {makeGameTerminal} from "../terminal/terminal.js"
import {GameStartData} from "../director/apis/clientside.js"
import { printReport } from "./utils/print-report.js"

export async function versusFlow({
		data: startData,
		connectivity,
		exit,
	}: {
		data: GameStartData
		connectivity: Connectivity
		exit: () => void
	}) {

	const trashbin = new Trashbin()
	const dr = trashbin.disposer

	const agent = new Agent(startData.agentState)
	const connection = connectivity.connection.payload

	console.log("versus", startData)
	printReport(agent, startData.teamId)

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
		agent.state = data.agentState
		printReport(agent, startData.teamId)
	}))

	dr(connectivity.machinery.onGameEnd(() => {
		console.log("versus got onGameEnd")
		exit()
	}))

	const terminal = await makeGameTerminal(
		agent,
		[startData.teamId],
		turn => connectivity
			.connection.payload?.serverside
			.game.submitTurn(turn),
	)

	return {
		world: terminal.world,
		dispose() {
			terminal.dispose()
			trashbin.dispose()
		},
	}
}

