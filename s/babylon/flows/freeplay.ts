
import {Agent} from "../../logic/agent.js"
import * as mapPool from "../../map-pool.js"
import {makeControls} from "../controls/controls.js"
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

	const getAgentState = () => extractAgentState(state, state.arbiter)
	const agent = new Agent(getAgentState())

	const visualizer = await makeVisualizer(agent)

	const disposeControls = makeControls({
		agent,
		visualizer,
		playAsTeams: [0, 1],
	})

	visualizer.update()

	return {
		world: visualizer.world,
		dispose() {
			disposeControls()
			visualizer.dispose()
		},
	}
}

