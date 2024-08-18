
import {fns} from "renraku"
import {Director} from "../director.js"

export type Serverside = {
	joinQueue(): Promise<void>
	submitTurn(): Promise<void>
}

export function makeServerside(
		governor: Director,
		clientId: number,
	) {

	const {matchmaker, gaming} = governor

	return fns({
		async joinQueue() {
			matchmaker.queue.add(clientId)

			for (const pair of matchmaker.extractPairs()) {
				const [gameId] = gaming.newGame(pair)

				for (const clientId of pair) {
					const client = governor.clients.get(clientId)!
					client.clientside.matchStart(gameId)
				}
			}
		},

		async submitTurn() {},
	})
}

