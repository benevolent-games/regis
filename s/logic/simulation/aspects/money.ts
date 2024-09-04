
import {AgentState, FullTeamInfo, TeamInfo} from "../../state.js"

export function canAfford(team: TeamInfo, cost: number | null): team is FullTeamInfo {
	return "resources" in team && cost !== null
		? team.resources >= cost
		: false
}

export function subtractResources(state: AgentState, teamId: number, cost: number) {
	const team = state.teams.at(teamId)!

	if ("resources" in team)
		team.resources -= cost
}

