
import {Agent} from "../../agent.js"
import {Rebuke} from "../../activities/types.js"
import {ArbiterState, Turn} from "../../state.js"
import {TurnTracker} from "../aspects/turn-tracker.js"
import {Activities} from "../../activities/activities.js"
import {awardIncomeToActiveTeam, applyWinByConquest} from "../aspects/turns.js"

export function simulateTurn(state: ArbiterState, turn: Turn) {
	const agent = new Agent(state)
	const turnTracker = new TurnTracker(agent, agent.activeTeamId)
	const activityManager = new Activities({agent, turnTracker})

	for (const choice of turn.choices) {
		const judgement = activityManager.judge(choice)

		if (judgement instanceof Rebuke)
			console.error("🚨", judgement.reason, choice)
		else
			judgement.commit()
	}

	state.reminders.revelations = activityManager.chalkboard.revelations

	applyWinByConquest(state)

	if (!state.context.conclusion) {
		awardIncomeToActiveTeam(state)
		state.context.turnCount += 1
	}
}

