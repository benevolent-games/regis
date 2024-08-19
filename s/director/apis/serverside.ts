
import {fns} from "renraku"
import {Game} from "../parts/gaming.js"
import {Director, WorldStats} from "../director.js"
import {AgentState, Turn} from "../../logic/state.js"

export type Serverside = {
	getWorldStats(): Promise<WorldStats>
	matchmaking: {
		joinQueue(): Promise<void>
		leaveQueue(): Promise<void>
	}
	game: {
		submitTurn(turn: Turn): Promise<AgentState>
		abandon(): Promise<void>
	}
}

type Session = {
	game: Game
	teamId: number
}

export function makeServerside(
		director: Director,
		clientId: number,
	) {

	let session: Session | null = null
	const {matchmaker, gaming} = director

	function requireSession() {
		if (!session)
			throw new Error("no valid session")
		return session
	}

	return fns<Serverside>({
		async getWorldStats() {
			return director.worldStats
		},

		matchmaking: {
			async joinQueue() {
				matchmaker.queue.add(clientId)

				for (const pair of matchmaker.extractPairs()) {
					const [gameId, game] = gaming.newGame(pair)

					game.pair.forEach((clientId, teamId) => {
						const client = director.clients.get(clientId)!
						const agentState = game.arbiter.statesRef.value.agents.at(teamId)!
						client.clientside.game.start({gameId, teamId, agentState})
						session = {game, teamId}
					})
				}
			},

			async leaveQueue() {
				matchmaker.queue.delete(clientId)
			},
		},

		game: {
			async submitTurn(turn) {
				const session = requireSession()
				const {game} = session
				game.arbiter.submitTurn(turn)

				game.pair.forEach((clientId, teamId) => {
					const client = director.clients.get(clientId)!
					const agentState = game.arbiter.getAgentState(teamId)
					client.clientside.game.update({agentState})
				})

				return game.arbiter.getAgentState(session.teamId)
			},

			async abandon() {},
		},
	})
}

