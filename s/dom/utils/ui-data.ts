
import {signal} from "@benev/slate"
import {Agent} from "../../logic/agent.js"
import {FullTeamInfo} from "../../logic/state.js"
import {TimeReport} from "../../tools/chess-timer/types.js"

export class UiData {
	activeTeamId = signal(0)
	ourTeamId = signal(0)
	ourTurn = signal(false)

	resources = signal(0)
	income = signal(0)
	timeReport = signal<TimeReport | null>(null)

	/////////////////////////////////////////////////
	/////////////////////////////////////////////////

	update({agent, teamId, timeReport}: {
			agent: Agent
			teamId: number
			timeReport: TimeReport
		}) {

		this.activeTeamId.value = agent.activeTeamId
		this.ourTeamId.value = teamId
		this.ourTurn.value = agent.activeTeamId === teamId

		const myTeam = agent.state.teams.at(teamId)! as FullTeamInfo
		this.resources.value = myTeam.resources
		this.income.value = agent.claims.getIncome(teamId)

		this.timeReport.value = timeReport
	}
}

