
import {Agent} from "./agent.js"
import {defaultRoster} from "./state/teams.js"
import {commit} from "./arbitration/commit.js"
import {GameState, Incident} from "./state/game.js"
import {extractAgentState} from "./arbitration/extract-agent-state.js"
import {initializeGameState} from "./arbitration/initialize-game-state.js"

type AgentResult = {agent: Agent, refresh: () => void}

export class Arbiter {
	state: GameState
	agents = new Set<AgentResult>()

	constructor(ascii: string) {
		this.state = initializeGameState({
			ascii,
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
	}

	commit = (incident: Incident.Any) => {
		this.state = commit(this.state, incident)
		for (const {refresh} of this.agents)
			refresh()
	}

	makeArbiterAgent() {
		const getState = () => extractAgentState(this.state, this.state.arbiter)
		const agent = new Agent(getState())
		const refresh = () => { agent.state = getState()}
		this.agents.add({agent, refresh})
		return agent
	}
}

