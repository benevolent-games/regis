
import * as mapPool from "../map-pool.js"
import {Arbiter} from "../logic/arbiter.js"
import {makeGameTerminal} from "../terminal/terminal.js"

export async function freeplayFlow() {
	const arbiter = new Arbiter(mapPool.bridge)
	const agent = arbiter.makeAgent(null)
	const terminal = await makeGameTerminal(agent, arbiter.submitTurn)

	arbiter.states.on(terminal.render)

	return {
		world: terminal.world,
		dispose() {
			terminal.dispose()
		},
	}
}

