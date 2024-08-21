
import {pubsub} from "@benev/slate"
import {GameStartData, GameUpdateData} from "../apis/clientside.js"

export class ClientMachinery {
	onGameStart = pubsub<[GameStartData]>()
	onGameUpdate = pubsub<[GameUpdateData]>()
}

