
import {Game} from "./game.js"
import {People} from "./people.js"
import {GamesStats} from "./games-stats.js"
import {logger} from "../plumbing/logger.js"
import {Couple, GamerSession, Person} from "../types.js"

export class Games extends Set<Game> {
	stats = new GamesStats()

	constructor(public people: People) {
		super()
	}

	stillConnected = (person: Person) => this.people.has(person)

	async newGame(couple: Couple) {
		for (const person of couple)
			this.#dropPersonOutOfAnyActiveGames(person)

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

	async #dropPersonOutOfAnyActiveGames(person: Person) {
		for (const game of this.values()) {
			if (game.couple.includes(person))
				await game.submitSurrender(game.getTeamId(person))
		}
	}
}

