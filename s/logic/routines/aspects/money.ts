
import {ArbiterState, FullTeamInfo} from "../../state.js"

export function purchase(state: ArbiterState, teamId: number, cost: number) {
	const team = state.teams.at(teamId)!
	if (canAfford(team, cost)) {
		team.resources -= cost
		return team.resources
	}
	else throw new Error(`team ${teamId} cannot afford cost ${cost}`)
}

export function canAfford(team: FullTeamInfo, cost: number) {
	return (team.resources >= cost)
}

