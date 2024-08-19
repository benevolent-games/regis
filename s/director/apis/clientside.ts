
import {fns} from "renraku"
import {Serverside} from "./serverside.js"
import {AgentState} from "../../logic/state.js"

export type Clientside = {
	game: {
		start(inputs: {
			gameId: number
			teamId: number
			agentState: AgentState
		}): Promise<void>
		update(inputs: {
			agentState: AgentState
		}): Promise<void>
		end(): Promise<void>
	}
}

export function makeClientside(
		getServerside: () => Serverside,
		machinery: any,
	) {

	return fns<Clientside>({
		game: {
			async start() {},
			async update() {},
			async end() {},
		},
	})
}

