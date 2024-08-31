
import {fns} from "renraku"
import {Director} from "../director.js"
import {noop} from "../../tools/noop.js"
import {Turn} from "../../logic/state.js"
import {Person, RegularReport} from "../types.js"

export type Serverside = {
	report(): Promise<RegularReport>
	matchmaking: {
		joinQueue(): Promise<void>
		leaveQueue(): Promise<void>
	}
	game: {
		submitTurn(turn: Turn): Promise<void>
		abandon(): Promise<void>
	}
}

export function makeServerside(
		director: Director,
		person: Person,
	) {

	const {matchmaker, games} = director
	const requireSession = () => games.requireSession(person)

	return fns<Serverside>({
		async report() {
			return {
				worldStats: {
					games: director.games.size,
					players: director.people.size,
					gamesInLastHour: director.games.stats.gamesInLastHour,
				},
				personStatus: (
					(director.games.findGameWithPerson(person))
						? "gaming"
					: (director.matchmaker.queue.has(person))
						? "queued"
						: "chilling"
				),
			}
		},

		matchmaking: {
			async joinQueue() {
				matchmaker.queue.add(person)

				for (const couple of matchmaker.extractCouples()) {
					const game = games.newGame(couple)
					const gameId = game.id
					const timeReport = game.timer.report()

					// send game start to people
					game.couple.forEach((gamer, teamId) => {
						gamer.clientside.game.start({
							gameId,
							teamId,
							timeReport,
							agentState: game.arbiter.teamAgent(teamId).state,
						}).catch(noop)
					})
				}
			},

			async leaveQueue() {
				matchmaker.queue.delete(person)
			},
		},

		game: {
			async submitTurn(turn) {
				const {game, teamId, person} = requireSession()
				const {gameTime} = game.timer
				const timeReport = game.timer.report()
				const righteousTurn = game.arbiter.activeTeamId

				if (teamId !== righteousTurn) {
					console.error(`person ${person.id} submitted an out-of-order turn`)
					return
				}

				// submit the turn
				game.arbiter.submitTurn({turn, gameTime})

				// send game updates to people
				game.couple.forEach((person, teamId) => {
					person.clientside.game.update({
						agentState: game.arbiter.teamAgent(teamId).state,
						timeReport,
					}).catch(noop)
				})
			},

			async abandon() {
				const {game} = requireSession()
				await games.endGame(game)
			},
		},
	})
}

