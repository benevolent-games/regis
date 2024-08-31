
import {Agent} from "../../agent.js"
import {AgentState, ArbiterState} from "../../state.js"

export function determineCurrentTeamId({
		context: {turnCount},
		initial: {config: {teams}},
	}: AgentState) {
	return turnCount % teams.length
}

export function applyWinByConquest(state: ArbiterState) {
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
	const agent = new Agent(state)
	const teamId = determineCurrentTeamId(state)
	const income = agent.claims.getIncome(teamId)
	const team = state.teams.at(teamId)!
	team.resources += income
}

