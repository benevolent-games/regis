
import {Remote} from "renraku"
import {Person, PersonId} from "./types.js"
import {Games} from "./parts/games.js"
import {People} from "./parts/people.js"
import {Clientside} from "./apis/clientside.js"
import {IdCounter} from "../tools/id-counter.js"
import {Matchmaker} from "./parts/matchmaker.js"
import {makeServerside} from "./apis/serverside.js"

export class Director {
	games = new Games()
	people = new People()
	matchmaker = new Matchmaker()

	#ids = new IdCounter()

	newPerson(clientside: Remote<Clientside>, closeConnection: () => void) {
		const id = this.#ids.next()
		const person = this.people.add({id, clientside, closeConnection})
		const serverside = makeServerside(this, person)
		const disconnected = async() => await this.#personDisconnected(person)
		return {person, serverside, disconnected}
	}

	#personDisconnected = async(person: Person) => {
		this.people.delete(person.id)
		this.matchmaker.queue.delete(person)

		// end any game they're associated with
		const game = this.games.findGameWithPerson(person)
		if (game)
			await this.endGame(game.id)
	}

	async endGame(gameId: number) {
		const game = this.games.get(gameId)
		if (game) {
			game.dispose()
			this.games.delete(gameId)
			await Promise.all(
				game.couple
					.filter(person => this.people.has(person.id))
					.map(client => client.clientside.game.end())
			)
		}
	}
}

