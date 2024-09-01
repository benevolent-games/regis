
import {Agent} from "../../agent.js"
import {AgentState, ArbiterState, Conclusion} from "../../state.js"

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
			reason: "conquest",
			winnerTeamId: winner.teamId,
		}
		return true
	}

	return false
}

export function applyWinByElimination(
		state: ArbiterState,
		eliminatedTeamId: number,
		reason: Conclusion["reason"],
	) {

	const teamIds = [...state.initial.config.teams.keys()]
	const teamsStillAlive = teamIds.filter(teamId => teamId !== eliminatedTeamId)

	if (teamsStillAlive.length === 1) {
		const [winnerTeamId] = teamsStillAlive
		state.context.conclusion = {reason, winnerTeamId}
	}
}

export function awardIncomeToActiveTeam(state: ArbiterState) {
	const agent = new Agent(state)
	const teamId = determineCurrentTeamId(state)
	const income = agent.claims.getIncome(teamId)
	const team = state.teams.at(teamId)!
	team.resources += income
}

