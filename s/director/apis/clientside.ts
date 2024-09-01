
import {fns} from "renraku"
import {Serverside} from "./serverside.js"
import {AgentState} from "../../logic/state.js"
import {ClientMachinery} from "../plumbing/machinery.js"
import {TimeReport} from "../../logic/utilities/chess-timer.js"

export type StartMemo = {
	gameId: number
	teamId: number
	agentState: AgentState
	timeReport: TimeReport
}

export type UpdateMemo = {
	agentState: AgentState
	timeReport: TimeReport
}

export type Clientside = {
	game: {
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

