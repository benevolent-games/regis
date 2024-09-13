
import {ExposedError} from "renraku"

import {Game} from "./game.js"
import {People} from "./people.js"
import {GamesStats} from "./games-stats.js"
import {Couple, GamerSession, Person} from "../types.js"
import { logger } from "../plumbing/logger.js"

export class Games extends Set<Game> {
	stats = new GamesStats()

	constructor(public people: People) {
		super()
	}

	stillConnected = (person: Person) => this.people.has(person)

	async newGame(couple: Couple) {
		this.#enforceNotAlreadyInGame(couple)
		const game = new Game({
			couple,
			stillConnected: this.stillConnected,
			removeThisGame: () => {
				this.delete(game)
				logger.log(`——→ ❌ delete game for ${couple.map(p => p.label).join(" and ")}`)
			},
		})
		this.add(game)
		this.stats.countNewGame()
		await game.initialize()
		logger.log(`——→ ✅ new game for ${couple.map(p => p.label).join(" and ")}`)
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
		throw new Error(`session not found for person`)
	}

	findGameWithPerson(person: Person) {
		for (const game of this.values()) {
			if (game.couple.some(p => p === person))
				return game
		}
		return undefined
	}

	#enforceNotAlreadyInGame(persons: Person[]) {
		for (const game of this.values()) {
			const person = game.couple.find(p => persons.includes(p))
			if (person)
				throw new ExposedError(`cannot create game, because a participant is already in another game`)
		}
	}
}

