
import {pubsub} from "@benev/slate"
import {GameStartData} from "../apis/clientside.js"

export class ClientMachinery {
	onMultiplayerGameStart = pubsub<[GameStartData]>()
}

