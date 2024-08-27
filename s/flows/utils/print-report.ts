
import {Agent} from "../../logic/agent.js"
import {FullTeamInfo} from "../../logic/state.js"

export function printReport(agent: Agent, teamId: number) {
	const {currentTurn, currentTeam} = agent
	const ourTurn = currentTurn === teamId
	const ourTeam = agent.state.teams.at(teamId)! as FullTeamInfo

	if (ourTurn) {
		console.log(`=== YOUR TURN! ${ourTeam.name} has ${ourTeam.resources} resources ===`)
	}
	else {
		console.log(`    (you now have ${ourTeam.resources} resources)`)
		console.log(`...waiting for ${currentTeam.name} turn...`)
	}

	if (agent.conclusion) {
		const {winner} = agent.conclusion
		const victory = teamId === winner
		if (victory) {
			console.log(`==========`)
			console.log(`👑 VICTORY for ${ourTeam.name}`)
			console.log(`==========`)
		}
		else {
			console.log(`=========`)
			console.log(`💀 DEFEAT for ${ourTeam.name}`)
			console.log(`=========`)
		}
	}
}

