
import {Pair} from "./matchmaker.js"
import {randomMap} from "../../map-pool.js"
import {Arbiter} from "../../logic/arbiter.js"
import {GameCounting} from "./game-counting.js"
import {IdCounter} from "../../tools/id-counter.js"

export class Game {
	arbiter = new Arbiter(randomMap().ascii)
	constructor(public pair: Pair) {}
}

export class Gaming {
	games = new Map<number, Game>
	#idCounter = new IdCounter()
	#gameCounting = new GameCounting()

	get gamesInLastHour() {
		return this.#gameCounting.gamesInLastHour
	}

	newGame(originalPair: Pair) {

		// randomize teams
		const pair = (Math.random() > 0.5)
			? originalPair.toReversed() as Pair
			: originalPair

		// create a new game
		const gameId = this.#idCounter.next()
		const game = new Game(pair)

		this.games.set(gameId, game)
		this.#gameCounting.count()

		return [gameId, game] as [number, Game]
	}

	findGameWithClient(clientId: number) {
		for (const entry of this.games) {
			const [,game] = entry
			if (game.pair.includes(clientId))
				return entry
		}
		return undefined
	}
}

