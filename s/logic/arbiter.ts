
import {clone, pubsub} from "@benev/slate"

import {Agent} from "./agent.js"
import {defaultRoster} from "./state/teams.js"
import {commit} from "./arbitration/commit.js"
import {GameState, Incident} from "./state/game.js"
import {extractAgentState} from "./arbitration/extract-agent-state.js"
import {initializeGameState} from "./arbitration/initialize-game-state.js"

export class Arbiter {
	state: GameState
	onStateChange = pubsub<[GameState]>()

	constructor(ascii: string) {
		this.state = initializeGameState({
			ascii,
			teams: [
				{
					name: "Blue",
					resources: 12,
					roster: defaultRoster(),
				},
				{
					name: "Orange",
					resources: 15,
					roster: defaultRoster(),
				},
			],
		})
	}

	actuate = (incident: Incident.Any) => {
		this.state = commit(this.state, incident)
		this.onStateChange.publish(this.state)
	}

	makeArbiterAgent() {
		const getState = () => clone(extractAgentState(this.state, this.state.arbiter))
		const agent = new Agent(getState())
		this.onStateChange(() => { agent.state = getState() })
		return agent
	}
}

