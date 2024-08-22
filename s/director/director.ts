
import {Remote} from "renraku"
import {Gaming} from "./parts/gaming.js"
import {Clientside} from "./apis/clientside.js"
import {IdCounter} from "../tools/id-counter.js"
import {Matchmaker} from "./parts/matchmaker.js"
import {makeServerside} from "./apis/serverside.js"

export type Client = {
	clientside: Remote<Clientside>
	closeConnection: () => void
}

export class Director {
	gaming = new Gaming()
	matchmaker = new Matchmaker()
	clients = new Map<number, Client>()

	#clientIdCounter = new IdCounter()

	acceptClient(clientside: Remote<Clientside>, closeConnection: () => void) {
		const clientId = this.#clientIdCounter.next()
		this.clients.set(clientId, {clientside, closeConnection})
		const serverside = makeServerside(this, clientId)
		const disconnected = () => this.#handleDisconnected(clientId)
		return {serverside, clientId, disconnected}
	}

	async #handleDisconnected(clientId: number) {

		// remove client from map
		this.clients.delete(clientId)

		// remove from matchmaking queue
		this.matchmaker.queue.delete(clientId)

		// end any game they're associated with
		const result = this.gaming.queryForClient(clientId)
		if (result)
			await this.endGame(result.gameId)
	}

	async endGame(gameId: number) {
		const game = this.gaming.games.get(gameId)
		if (game) {
			this.gaming.games.delete(gameId)
			await Promise.all(
				game.pair
					.map(clientId => this.clients.get(clientId))
					.filter(client => !!client)
					.map(client => client.clientside.game.end())
			)
		}
	}
}

