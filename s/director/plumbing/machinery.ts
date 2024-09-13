
import {pubsub} from "@benev/slate"
import {Agent} from "../../logic/agent.js"
import {InitialMemo, StartMemo, UpdateMemo} from "../apis/clientside.js"

export type ClientGameSession = {
	agent: Agent
	teamId: number
	gameId: number
}

export class ClientMachinery {
	onGameInitialize = pubsub<[InitialMemo]>()
	onGameStart = pubsub<[StartMemo]>()
	onGameUpdate = pubsub<[UpdateMemo]>()
	onGameEnd = pubsub<[]>()

	gameSession: ClientGameSession | null = null

	constructor() {
		this.onGameInitialize(memo => {
			this.gameSession = {
				teamId: memo.teamId,
				gameId: memo.gameId,
				agent: new Agent(memo.agentState),
			}
		})
	}
}

