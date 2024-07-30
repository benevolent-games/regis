
import {AgentState, FullTeamInfo, isFullTeamInfo} from "../../state.js"

export function purchase(state: AgentState, teamId: number, cost: number) {
	const team = state.teams.at(teamId)!
	if (isFullTeamInfo(team)) {
		if (canAfford(team, cost)) {
			team.resources -= cost
			return team.resources
		}
		else throw new Error(`team ${teamId} cannot afford cost ${cost}`)
	}
	return null
}

export function canAfford(team: FullTeamInfo, cost: number) {
	if (cost === null)
		throw new Error(`invalid cost null`)
	return team.resources >= cost
}

