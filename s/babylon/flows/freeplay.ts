
import {makeAgent} from "../agent/agent.js"
import * as mapPool from "../../map-pool.js"
import {defaultRoster} from "../../logic/state/teams.js"
import {makeVisualizer} from "../visualizer/visualizer.js"
import {extractAgentState} from "../../logic/arbitration/extract-agent-state.js"
import {initializeGameState} from "../../logic/arbitration/initialize-game-state.js"

export async function freeplayFlow() {
	let state = initializeGameState({
		ascii: mapPool.bridge,
		teams: [
			{
				name: "Blue",
				resources: 9, // first-turn income will be added
				roster: defaultRoster(),
			},
			{
				name: "Orange",
				resources: 12, // first-turn income will be added
				roster: defaultRoster(),
			},
		],
	})

	// function actuate(incident: Incident.Any) {
	// 	state = commit(state, incident)
	// }

	const getState = () => extractAgentState(state, state.arbiter)

	const visualizer = await makeVisualizer()

	const disposeAgent = makeAgent({
		getState,
		visualizer,
		playAsTeams: [0, 1],
	})

	function update() {
		const agentState = getState()
		visualizer.update(agentState)
	}

	update()

	return {
		world: visualizer.world,
		dispose() {
			disposeAgent()
			visualizer.dispose()
		},
	}
}

