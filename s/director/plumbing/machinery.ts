
import {pubsub} from "@benev/slate"
import {StartMemo, UpdateMemo} from "../apis/clientside.js"

export class ClientMachinery {
	onGameStart = pubsub<[StartMemo]>()
	onGameUpdate = pubsub<[UpdateMemo]>()
	onGameEnd = pubsub<[]>()
}

