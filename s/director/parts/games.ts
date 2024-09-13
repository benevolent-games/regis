
import {ExposedError} from "renraku"

import {Game} from "./game.js"
import {People} from "./people.js"
import {GamesStats} from "./games-stats.js"
import {IdMappable2} from "../../tools/map2.js"
import {IdCounter} from "../../tools/id-counter.js"
import {Couple, GamerSession, Person} from "../types.js"

export class Games extends IdMappable2<number, Game> {
	stats = new GamesStats()
	#ids = new IdCounter()

	constructor(public people: People) {
		super()
	}

	stillConnected = (person: Person) => this.people.got(person)

	async newGame(couple: Couple) {
		this.#enforceThatPeopleAreNotAlreadyInGame(couple)
		const id = this.#ids.next()
		const game = new Game({
			id,
			couple,
			stillConnected: this.stillConnected,
			removeThisGame: () => {
				this.map.delete(id)
			},
		})
		this.map.add(game)
		this.stats.countNewGame()
		await game.initialize()
		return game
	}

	requireSession(person: Person): GamerSession {
		for (const game of this.values()) {
			const couplet = game.couple.map((person, teamId) => ({person, teamId}))
			for (const info of couplet) {
				if (info.person === person)
					return {person, game, teamId: info.teamId}
			}
		}
		throw new Error(`session not found for person id ${person.id}`)
	}

	findGameWithPerson(person: Person) {
		for (const game of this.values()) {
			if (game.couple.some(p => p === person))
				return game
		}
		return undefined
	}

	#enforceThatPeopleAreNotAlreadyInGame(people: Person[]) {
		for (const game of this.values()) {
			const person = game.couple.find(p => people.includes(p))
			if (person)
				throw new ExposedError(`cannot create game, because person [${person.id}] is already in another game`)
		}
	}
}

