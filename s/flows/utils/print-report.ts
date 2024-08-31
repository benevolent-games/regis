
import {Agent} from "../../logic/agent.js"
import {FullTeamInfo} from "../../logic/state.js"

export function printReport(agent: Agent, teamId: number) {
	const {activeTeamId, activeTeam} = agent
	const ourTurn = activeTeamId === teamId
	const ourTeam = agent.state.teams.at(teamId)! as FullTeamInfo
	const {turnCount: turnId} = agent.state.context

	if (turnId === 0) {
		const map = agent.state.initial.mapMeta
		console.log(`🎲 $$$ GAME START on "${map.name}" by "${map.author}"`)
	}

	if (ourTurn) {
		console.log(`=== YOUR TURN! ${ourTeam.name} has ${ourTeam.resources} resources ===`)
	}
	else {
		console.log(`    (you now have ${ourTeam.resources} resources)`)
		console.log(`...waiting for ${activeTeam.name} turn...`)
	}

	if (agent.conclusion) {
		const {winningTeamIndex} = agent.conclusion
		const victory = teamId === winningTeamIndex
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

