
import {Agent} from "../../agent.js"
import {AgentState, ArbiterState} from "../../state.js"

export function activeTeamIndex({
		context: {turnIndex},
		initial: {config: {teams}},
	}: AgentState) {
	return turnIndex % teams.length
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
			winningTeamIndex: winner.teamId,
		}
		return true
	}

	return false
}

export function awardIncomeToActiveTeam(state: ArbiterState) {
	const {universalBasicIncome} = state.initial.config
	const team = state.teams.at(activeTeamIndex(state))!
	team.resources += universalBasicIncome
}

