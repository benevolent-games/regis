
import {signal, Signal} from "@benev/slate"

import {Agent} from "../../logic/agent.js"
import {TimeReport} from "../../tools/chess-timer/types.js"
import {TerminalActions} from "../../terminal/parts/terminal-actions.js"

export type Porthole = {
	agent: Agent
	teamId: number
	timeReport: TimeReport
	actions: TerminalActions
}

export class PortholePod {
	porthole: Signal<Porthole>

	constructor(public fn: () => Porthole) {
		this.porthole = signal(fn())
	}

	update = () => {
		this.porthole.value = this.fn()
	}
}

// export class UiBridge {
// 	data: Signal<UiData>
//
// 	constructor(
// 			data: UiData,
// 			public actions: TerminalActions
// 		) {
// 		this.data = signal(data)
// 	}
//
// 	activeTeamId = signal(0)
// 	ourTeamId = signal(0)
// 	ourTurn = signal(false)
//
// 	resources = signal(0)
// 	income = signal(0)
// 	timeReport = signal<TimeReport | null>(null)
// 	turnCount = signal<number>(0)
//
// 	/////////////////////////////////////////////////
// 	/////////////////////////////////////////////////
//
// 	update({agent, teamId, timeReport}: {
// 			agent: Agent
// 			teamId: number
// 			timeReport: TimeReport
// 		}) {
//
// 		this.activeTeamId.value = agent.activeTeamId
// 		this.ourTeamId.value = teamId
// 		this.ourTurn.value = agent.activeTeamId === teamId
// 		this.turnCount.value = agent.state.context.turnCount
//
// 		const myTeam = agent.state.teams.at(teamId)! as FullTeamInfo
// 		this.resources.value = myTeam.resources
// 		this.income.value = agent.claims.getIncome(teamId)
//
// 		this.timeReport.value = timeReport
// 	}
// }
//
