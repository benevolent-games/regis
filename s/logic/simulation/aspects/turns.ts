
import {Agent} from "../../agent.js"
import {ArbiterState} from "../../state.js"

export function nextTurn(state: ArbiterState) {
	const {context, initial} = state
	context.currentTurn += 1

	if (context.currentTurn > (initial.config.teams.length - 1))
		context.currentTurn = 0
}

export function processWinByConquest(state: ArbiterState) {
	const agent = new Agent(state)

	const teamsStillStanding = state.initial.config.teams
		.map((team, teamId) => ({team, teamId}))
		.filter(({teamId}) => [...agent.units.list()]
			.some(unit => unit.team === teamId && unit.kind === "king"))

	if (teamsStillStanding.length === 1) {
		const [winner] = teamsStillStanding
		state.context.conclusion = {
			kind: "conclusion",
			reason: "conquest",
			winner: winner.teamId,
		}
		return true
	}

	return false
}

export function awardIncome(state: ArbiterState) {
	const {universalBasicIncome} = state.initial.config
	for (const team of state.teams)
		team.resources += universalBasicIncome
}

