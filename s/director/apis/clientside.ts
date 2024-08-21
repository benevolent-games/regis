
import {fns} from "renraku"
import {Serverside} from "./serverside.js"
import {AgentState} from "../../logic/state.js"
import {ClientMachinery} from "../plumbing/machinery.js"

export type GameStartData = {
	gameId: number
	teamId: number
	agentState: AgentState
}

export type GameUpdateData = {
	agentState: AgentState
}

export type Clientside = {
	game: {
		start(data: GameStartData): Promise<void>
		update(data: GameUpdateData): Promise<void>
		end(): Promise<void>
	}
}

export function makeClientside(
		getServerside: () => Serverside,
		machinery: ClientMachinery,
	) {

	return fns<Clientside>({
		game: {
			async start(data) {
				machinery.onGameStart.publish(data)
			},
			async update() {},
			async end() {},
		},
	})
}

