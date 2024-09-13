
import {fns} from "renraku"
import {Director} from "../director.js"
import {Turn} from "../../logic/state.js"
import {logErr} from "../../tools/log-err.js"
import {Person, RegularReport} from "../types.js"

export type Serverside = {
	report(): Promise<RegularReport>
	matchmaking: {
		joinQueue(): Promise<void>
		leaveQueue(): Promise<void>
	}
	game: {
		submitTurn(turn: Turn): Promise<void>
		submitSurrender(): Promise<void>
	}
}

export function makeServerside(director: Director, person: Person) {
	const {matchmaker, games} = director
	const requireSession = () => games.requireSession(person)

	return fns<Serverside>({
		async report() {
			return {
				worldStats: director.stats,
				personStatus: director.getPersonStatus(person),
			}
		},

		matchmaking: {
			async joinQueue() {
				matchmaker.queue.add(person)
				for (const couple of matchmaker.extractCouples())
					games.newGame(couple).catch(logErr)
			},

			async leaveQueue() {
				matchmaker.queue.delete(person)
			},
		},

		game: {
			async submitTurn(turn) {
				const {game, teamId} = requireSession()
				await game.submitTurn(turn, teamId)
			},

			async submitSurrender() {
				const {game, teamId} = requireSession()
				await game.submitSurrender(teamId)
			},
		},
	})
}

