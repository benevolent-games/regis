
import * as mapPool from "../map-pool.js"
import {Arbiter} from "../logic/arbiter.js"
import {makeGameTerminal} from "../terminal/terminal.js"

export async function freeplayFlow() {
	const arbiter = new Arbiter(mapPool.bridge)
	const agent = arbiter.makeAgent(null)

	const terminal = await makeGameTerminal(agent, arbiter.submitTurn)
	arbiter.statesRef.on(terminal.render)

	function printReport() {
		const states = arbiter.statesRef.value
		const {currentTurn} = states.arbiter.context
		const [team1, team2] = states.arbiter.teams

		if (currentTurn === 0)
			console.log(`[[ ${team1.name} +${team1.resources} ]]   ${team2.name} +${team2.resources}`)
		else
			console.log(`   ${team1.name} +${team1.resources}   [[ ${team2.name} +${team2.resources} ]]`)

		if (agent.conclusion) {
			const {winner} = agent.conclusion
			const winnerName = states.arbiter.teams.at(winner)!.name
			console.log(`=============================`)
			console.log(`GAME OVER! ${winnerName} wins`)
			console.log(`=============================`)
		}
	}

	printReport()
	arbiter.statesRef.on(printReport)

	return {
		world: terminal.world,
		dispose() {
			terminal.dispose()
		},
	}
}

