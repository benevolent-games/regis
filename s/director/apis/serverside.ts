
import {fns} from "renraku"
import {Director} from "../director.js"
import {noop} from "../../tools/noop.js"
import {ClientId, RegularReport} from "../types.js"
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
		clientId: ClientId,
	) {

	const {matchmaker, gaming} = director

	function requireSession() {
		const session = director.gaming.queryForClient(clientId)
		if (!session)
			throw new Error("no valid session")
		return session
	}

	return fns<Serverside>({
		async report() {
			return {
				worldStats: {
					games: director.gaming.games.size,
					players: director.clients.size,
					gamesInLastHour: director.gaming.gamesInLastHour,
				},
				clientStatus: (
					(director.gaming.findGameWithClient(clientId))
						? "gaming"
					: (director.matchmaker.queue.has(clientId))
						? "queued"
						: "chilling"
				),
			}
		},

		matchmaking: {
			async joinQueue() {
				matchmaker.queue.add(clientId)

				for (const pair of matchmaker.extractPairs()) {
					const [gameId, game] = gaming.newGame(pair)

					game.pair.forEach((clientId, teamId) => {
						const client = director.clients.get(clientId)!
						const agentState = game.arbiter.statesRef.value.agents.at(teamId)!
						client.clientside.game.start({gameId, teamId, agentState}).catch(noop)
					})
				}
			},

			async leaveQueue() {
				matchmaker.queue.delete(clientId)
			},
		},

		game: {
			async submitTurn(turn) {
				const {game, teamId} = requireSession()
				game.arbiter.submitTurn(turn)

				game.pair.forEach((clientId, teamId) => {
					const client = director.clients.get(clientId)!
					const agentState = game.arbiter.getAgentState(teamId)
					client.clientside.game.update({agentState}).catch(noop)
				})

				return game.arbiter.getAgentState(teamId)
			},

			async abandon() {
				const {gameId} = requireSession()
				await director.endGame(gameId)
			},
		},
	})
}

