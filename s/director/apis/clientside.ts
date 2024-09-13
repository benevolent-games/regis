
import {fns} from "renraku"
import {Serverside} from "./serverside.js"
import {AgentState} from "../../logic/state.js"
import {ClientMachinery} from "../plumbing/machinery.js"
import {TimeReport} from "../../tools/chess-timer/types.js"

export type InitialMemo = {
	gameId: number
	teamId: number
	pregameDelay: number
	agentState: AgentState
}

export type StartMemo = {
	agentState: AgentState
	timeReport: TimeReport
}

export type UpdateMemo = {
	agentState: AgentState
	timeReport: TimeReport
}

export type Clientside = {
	game: {
		initialize(memo: InitialMemo): Promise<void>
		start(memo: StartMemo): Promise<void>
		update(memo: UpdateMemo): Promise<void>
		end(): Promise<void>
	}
}

export function makeClientside(
		machinery: ClientMachinery,
		_getServerside: () => Serverside,
	) {

	return fns<Clientside>({
		game: {
			async initialize(memo) {
				machinery.onGameInitialize.publish(memo)
			},
			async start(memo) {
				machinery.onGameStart.publish(memo)
			},
			async update(memo) {
				machinery.onGameUpdate.publish(memo)
			},
			async end() {
				machinery.onGameEnd.publish()
			},
		},
	})
}

