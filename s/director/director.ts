
import {Gaming} from "./parts/gaming.js"
import {Clientside} from "./apis/clientside.js"
import {IdCounter} from "../tools/id-counter.js"
import {Matchmaker} from "./parts/matchmaker.js"
import {makeServerside} from "./apis/serverside.js"

export class Director {
	gaming = new Gaming()
	matchmaker = new Matchmaker()
	clients = new Map<number, Clientside>()

	#clientIdCounter = new IdCounter()

	acceptClient(clientside: Clientside) {
		const clientId = this.#clientIdCounter.next()
		this.clients.set(clientId, clientside)
		const serverside = makeServerside(this, clientId)
		return {serverside, clientId}
	}

	async goodbyeClient(clientId: number) {
		this.matchmaker.queue.delete(clientId)
		const result = this.gaming.findGameWithClient(clientId)
		if (result) {
			const [gameId] = result
			await this.#endMatch(gameId)
		}
	}

	async #endMatch(matchId: number) {
		const game = this.gaming.games.get(matchId)
		if (game) {
			this.gaming.games.delete(matchId)
			await Promise.all(
				game.pair
					.map(clientId => this.clients.get(clientId))
					.filter(clientside => !!clientside)
					.map(clientside => clientside.matchFinish())
			)
		}
	}
}

