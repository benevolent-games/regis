
import {clone} from "@benev/slate"

import {Agent} from "../agent.js"
import {Denial} from "./aspects/denials.js"
import {TurnTracker} from "./aspects/turn-tracker.js"
import {UnitFreedom} from "./aspects/unit-freedom.js"
import {makeProposers} from "./proposer/make-proposers.js"
import {censorTeam, censorUnits} from "./aspects/censorship.js"
import {limitedVision, universalVision} from "./aspects/vision.js"
import {ArbiterState, FullTeamInfo, GameHistory, GameStates} from "../state.js"
import {awardIncomeToActiveTeam, processWinByConquest} from "./aspects/turns.js"

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
export function simulateGame({initial, turns}: GameHistory): GameStates {

	// establish the authoritative state for the game,
	// the arbiter "knows all"
	const state: ArbiterState = clone({
		initial,
		units: initial.units,
		context: {
			nextId: initial.id,
			turnIndex: 0,
			conclusion: null,
		},
		teams: initial.config.teams.map((team): FullTeamInfo => ({
			name: team.name,
			resources: initial.config.startingResources,
		})),
		investments: [],
		reminders: {
			choices: [],
			kills: [],
		},
	})

	// we churn through every event in the game history,
	// updating the arbiter state as we go along
	for (const turn of turns) {
		const agent = new Agent(state)
		const turnTracker = new TurnTracker(agent, agent.activeTeamIndex)
		const proposers = makeProposers({
			agent,
			turnTracker,
			freedom: new UnitFreedom(),
		})

		for (const choice of turn.choices) {
			const proposal = proposers[choice.kind](choice as any)
			if (proposal instanceof Denial)
				console.error("🚨", proposal.reason)
			else
				proposal()
		}

		const gameOver = processWinByConquest(state)

		if (gameOver)
			break
		else {
			state.context.turnIndex += 1
			awardIncomeToActiveTeam(state)
		}
	}

	// finally, we return the result states
	return {
		arbiter: state,
		agents: state.teams.map((_, teamId) => {
			const vision = turns.length === 0
				? universalVision(state)
				: limitedVision(state, teamId)
			return {
				initial: state.initial,
				context: state.context,
				units: censorUnits(state.units, vision),
				teams: state.teams.map((team, id) => id === teamId ? team : censorTeam(team)),
				investments: state.investments,
				reminders: {
					choices: [],
					kills: [],
				},
			}
		}),
	}
}

