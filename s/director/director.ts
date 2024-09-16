
import {Remote} from "renraku"
import {Games} from "./parts/games.js"
import {People} from "./parts/people.js"
import {Clientside} from "./apis/clientside.js"
import {Matchmaker} from "./parts/matchmaker.js"
import {makeServerside} from "./apis/serverside.js"
import {PeopleLabels} from "./parts/people-labels.js"
import {Person, PersonStatus, WorldStats} from "./types.js"

export class Director {
	people = new People()
	games = new Games(this.people)
	matchmaker = new Matchmaker()

	labels = new PeopleLabels()

	newPerson(clientside: Remote<Clientside>, closeConnection: () => void) {
		const label = this.labels.next()
		const person: Person = {label, clientside, closeConnection}
		this.people.add(person)
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
					: "relaxing"
		)
	}

	#personDisconnected = async(person: Person) => {
		this.people.delete(person)
		this.matchmaker.queue.delete(person)

		// end any game they're associated with
		const game = this.games.findGameWithPerson(person)

		if (game)
			await game.submitSurrender(game.getTeamId(person))
	}
}

