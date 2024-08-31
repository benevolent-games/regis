
import {Agent} from "../../agent.js"
import {Denial} from "../aspects/denials.js"
import {ArbiterState, Turn} from "../../state.js"
import {TurnTracker} from "../aspects/turn-tracker.js"
import {UnitFreedom} from "../aspects/unit-freedom.js"
import {makeProposers} from "../proposer/make-proposers.js"
import {awardIncomeToActiveTeam, processWinByConquest} from "../aspects/turns.js"

export function simulateTurn(state: ArbiterState, turn: Turn) {
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

	if (!gameOver) {
		state.context.turnIndex += 1
		awardIncomeToActiveTeam(state)
	}

	return gameOver
}

