
import {clone} from "@benev/slate"

import {Agent} from "../agent.js"
import {Proposer} from "./proposer.js"
import {universalVision} from "./aspects/vision.js"
import {censorTeam, censorUnits} from "./aspects/censorship.js"
import {TurnTracker} from "../../terminal/parts/turn-tracker.js"
import {awardIncome, processWinByConquest, nextTurn} from "./aspects/turns.js"
import {ArbiterState, FullTeamInfo, GameHistory, GameStates} from "../state.js"

/**
 * compute the state of the game.
 *
 * we're using an "event sourcing" approach,
 * where given the initial conditions, and a sequence of historical events,
 * we can compute the state of the game.
 *
 * so, to orchestrate a game-in-progress,
 * for each turn, we add a historical event -- then we simply recompute the
 * game state again.
 */
export function simulateGame({initial, chronicle}: GameHistory): GameStates {

	// establish the authoritative state for the game,
	// the arbiter "knows all"
	const state: ArbiterState = clone({
		initial,
		units: initial.units,
		context: {
			currentTurn: 0,
			conclusion: null,
		},
		teams: initial.config.teams.map((team, teamIndex): FullTeamInfo => ({
			name: team.name,
			resources: initial.config.startingResources + (
				teamIndex * initial.config.universalBasicIncome
			),
			investments: [],
		})),
		reminders: {
			choices: [],
			kills: [],
		},
	})

	// we churn through every event in the game history,
	// updating the arbiter state as we go along
	for (const turn of chronicle) {
		const agent = new Agent(state)
		const teamControl = [agent.currentTurn]
		const proposer = new Proposer(agent, new TurnTracker({agent, teamControl}))

		for (const choice of turn.choices) {
			const report = proposer.choosers[choice.kind](choice as any)
			if (report) report.commit()
			else throw new Error("invalid turn choice")
		}

		const gameOver = processWinByConquest(state)

		if (gameOver) {
			break
		}
		else {
			nextTurn(state)
			awardIncome(state)
		}
	}

	// finally, we return the result states
	return {
		arbiter: state,
		agents: state.teams.map((_, teamId) => {
			const vision = universalVision(state, teamId)
			return {
				initial: state.initial,
				context: state.context,
				units: censorUnits(state.units, vision),
				teams: state.teams.map((team, id) => id === teamId ? team : censorTeam(team)),
				reminders: {
					choices: [],
					kills: [],
				},
			}
		}),
	}
}

