

import {clone} from "@benev/slate"

import {asciiMap} from "../ascii/ascii-map.js"
import {Team, TeamFoggy} from "../state/teams.js"
import {GameDetails, GameState} from "../state/game.js"

type Options = {
	ascii: string
	teams: Team[]
}

export function initialize({ascii, teams}: Options): GameState {
	const {board, units, claims} = asciiMap(ascii)
	const details: GameDetails = {teams, board, units, claims}
	return clone({
		initiation: details,
		chronicle: [],
		arbiter: details,
		context: {currentTurn: 0, winner: null},
		agents: teams.map((_, agentIndex) => ({
			...details,
			teams: teams.map((team, teamIndex) => {
				return (teamIndex === agentIndex
					? team
					: {name: team.name}
				) as Team | TeamFoggy
			}),
		})),
	})
}

