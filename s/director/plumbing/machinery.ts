
import {pubsub} from "@benev/slate"
import {InitialMemo, StartMemo, UpdateMemo} from "../apis/clientside.js"

export class ClientMachinery {
	onGameInitialize = pubsub<[InitialMemo]>()
	onGameStart = pubsub<[StartMemo]>()
	onGameUpdate = pubsub<[UpdateMemo]>()
	onGameEnd = pubsub<[]>()
}

