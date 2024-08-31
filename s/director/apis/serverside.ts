
import {fns} from "renraku"
import {Director} from "../director.js"
import {noop} from "../../tools/noop.js"
import {Person, RegularReport} from "../types.js"
import {AgentState, Turn} from "../../logic/state.js"

export type Serverside = {
	report(): Promise<RegularReport>
	matchmaking: {
		joinQueue(): Promise<void>
		leaveQueue(): Promise<void>
	}
	game: {
		submitTurn(turn: Turn): Promise<AgentState>
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

					game.couple.forEach((gamer, teamId) => {
						const agentState = game.arbiter.statesRef.value.agents.at(teamId)!
						gamer.clientside.game.start({
							gameId,
							teamId,
							agentState,
							timeReport,
						}).catch(noop)
					})
				}
			},

			async leaveQueue() {
				// TODO hmm probably should ensure they're not in a game already too
				matchmaker.queue.delete(person)
			},
		},

		game: {
			async submitTurn(turn) {
				const {game, teamId} = requireSession()
				const {gameTime} = game.timer
				const timeReport = game.timer.report()

				game.arbiter.submitTurn({turn, gameTime})

				game.couple.forEach((person, teamId) => {
					const agentState = game.arbiter.getAgentState(teamId)
					person.clientside.game.update({agentState, timeReport}).catch(noop)
				})

				return game.arbiter.getAgentState(teamId)
			},

			async abandon() {
				const {game} = requireSession()
				await director.endGame(game.id)
			},
		},
	})
}

