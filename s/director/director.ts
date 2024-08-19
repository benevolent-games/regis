
import {Gaming} from "./parts/gaming.js"
import {Clientside} from "./apis/clientside.js"
import {IdCounter} from "../tools/id-counter.js"
import {Matchmaker} from "./parts/matchmaker.js"
import {makeServerside} from "./apis/serverside.js"

export type Client = {
	clientside: Clientside
	closeConnection: () => void
}

export type WorldStats = {
	games: number
	players: number
	gamesInLastHour: number
}

export class Director {
	gaming = new Gaming()
	matchmaker = new Matchmaker()
	clients = new Map<number, Client>()

	#clientIdCounter = new IdCounter()

	get worldStats(): WorldStats {
		return {
			games: this.gaming.games.size,
			players: this.clients.size,
			gamesInLastHour: this.gaming.gamesInLastHour,
		}
	}

	acceptClient(clientside: Clientside, closeConnection: () => void) {
		const clientId = this.#clientIdCounter.next()
		this.clients.set(clientId, {clientside, closeConnection})
		const serverside = makeServerside(this, clientId)
		return {serverside, clientId}
	}

	async goodbyeClient(clientId: number) {

		// remove from matchmaking queue
		this.matchmaker.queue.delete(clientId)

		// end any game they're associated with
		const result = this.gaming.findGameWithClient(clientId)
		if (result) {
			const [gameId] = result
			await this.#endGame(gameId)
		}
	}

	async #endGame(gameId: number) {
		const game = this.gaming.games.get(gameId)
		if (game) {
			this.gaming.games.delete(gameId)
			await Promise.all(
				game.pair
					.map(clientId => this.clients.get(clientId))
					.filter(client => !!client)
					.map(client => {
						client.clientside.game.end()
					})
			)
		}
	}
}

