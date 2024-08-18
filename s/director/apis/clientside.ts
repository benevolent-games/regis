
import {fns} from "renraku"
import {Serverside} from "./serverside.js"
import {AgentState} from "../../logic/state.js"

export type Clientside = {
	gameStart(inputs: {
		gameId: number
		teamId: number
		agentState: AgentState
	}): Promise<void>

	gameUpdate(inputs: {
		agentState: AgentState
	}): Promise<void>

	gameEnd(): Promise<void>
}

export function makeClientside(
		getServerside: () => Serverside,
		machinery: any,
	) {

	return fns<Clientside>({
		async gameStart() {},

		async gameUpdate() {},

		async gameEnd() {},
	})
}

