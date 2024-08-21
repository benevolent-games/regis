
import {Trashbin} from "@benev/slate"

import {Agent} from "../logic/agent.js"
import {Connectivity} from "../net/connectivity.js"
import {makeGameTerminal} from "../terminal/terminal.js"
import {GameStartData} from "../director/apis/clientside.js"

export async function versusFlow({
		data,
		connectivity,
	}: {
		data: GameStartData
		connectivity: Connectivity
	}) {

	const trashbin = new Trashbin()
	const dr = trashbin.disposer

	const agent = new Agent(data.agentState)
	const connection = connectivity.connection.payload!

	dr(connection.machinery.onGameUpdate(data => {
		agent.state = data.agentState
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

