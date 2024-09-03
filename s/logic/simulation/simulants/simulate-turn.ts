
import {Agent} from "../../agent.js"
import {Denial} from "../aspects/denials.js"
import {ArbiterState, Turn} from "../../state.js"
import {Chalkboard} from "../proposer/chalkboard.js"
import {TurnTracker} from "../aspects/turn-tracker.js"
import {UnitFreedom} from "../aspects/unit-freedom.js"
import {makeProposers} from "../proposer/make-proposers.js"
import {awardIncomeToActiveTeam, applyWinByConquest} from "../aspects/turns.js"

export function simulateTurn(state: ArbiterState, turn: Turn) {
	const agent = new Agent(state)
	const chalkboard = new Chalkboard()
	const turnTracker = new TurnTracker(agent, agent.activeTeamId)

	const proposers = makeProposers({
		agent,
		chalkboard,
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

	state.reminders.revelations = chalkboard.revelations

	applyWinByConquest(state)

	if (!state.context.conclusion) {
		awardIncomeToActiveTeam(state)
		state.context.turnCount += 1
	}
}

