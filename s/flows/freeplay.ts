
import * as mapPool from "../map-pool.js"
import {Arbiter} from "../logic/arbiter.js"
import {makeGameTerminal} from "../terminal/terminal.js"

export async function freeplayFlow() {
	const arbiter = new Arbiter(mapPool.bridge)
	const agent = arbiter.makeArbiterAgent()
	const terminal = await makeGameTerminal(agent, arbiter.actuate)
	return {
		world: terminal.world,
		dispose() {
			terminal.dispose()
		},
	}
}

