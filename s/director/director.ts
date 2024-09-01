
import {Remote} from "renraku"
import {Person, PersonStatus, WorldStats} from "./types.js"
import {Games} from "./parts/games.js"
import {People} from "./parts/people.js"
import {Clientside} from "./apis/clientside.js"
import {IdCounter} from "../tools/id-counter.js"
import {Matchmaker} from "./parts/matchmaker.js"
import {makeServerside} from "./apis/serverside.js"

export class Director {
	people = new People()
	games = new Games(this.people)
	matchmaker = new Matchmaker()

	#ids = new IdCounter()

	newPerson(clientside: Remote<Clientside>, closeConnection: () => void) {
		const id = this.#ids.next()
		const person = this.people.add({id, clientside, closeConnection})
		const serverside = makeServerside(this, person)
		const disconnected = async() => await this.#personDisconnected(person)
		return {person, serverside, disconnected}
	}

	get stats(): WorldStats {
		return {
			games: this.games.size,
			players: this.people.size,
			gamesInLastHour: this.games.stats.gamesInLastHour,
		}
	}

	getPersonStatus(person: Person): PersonStatus {
		return (
			(this.games.findGameWithPerson(person))
				? "gaming"
				: (this.matchmaker.queue.has(person))
					? "queued"
					: "chilling"
		)
	}

	#personDisconnected = async(person: Person) => {
		this.people.delete(person.id)
		this.matchmaker.queue.delete(person)

		// end any game they're associated with
		const game = this.games.findGameWithPerson(person)
		if (game)
			await this.games.endGame(game)
	}
}

