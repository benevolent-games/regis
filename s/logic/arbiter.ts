
import {clone} from "@benev/slate"
import {pubsub} from "@benev/toolbox"

import {compute} from "./compute.js"
import {Agent} from "./helpers/agent.js"
import {asciiMap} from "./ascii/ascii-map.js"
import {defaultGameConfig, defaultRoster, GameHistory, GameStates, Incident} from "./state.js"

export type FnActuate = (incident: Incident.Any) => void

export class Arbiter {
	history: GameHistory

	states: GameStates
	onStateChange = pubsub()

	constructor(ascii: string) {
		const {board, units} = asciiMap(ascii)
		this.history = {
			chronicle: [],
			initial: {
				board,
				units,
				config: defaultGameConfig(),
				teams: [
					{name: "Blue", roster: defaultRoster()},
					{name: "Orange", roster: defaultRoster()},
				],
			},
		}
		this.states = this.#commit(this.history)
	}

	makeAgent(teamId: null | number) {
		const getState = () => {
			return teamId === null
				? this.states.arbiter
				: this.states.agents[teamId]
		}
		const agent = new Agent(getState())
		const update = () => { agent.state = getState() }
		this.onStateChange(update)
		return agent
	}

	actuate: FnActuate = incident => {
		const newHistory = clone(this.history)
		newHistory.chronicle.push(incident)
		this.#commit(newHistory)
	}

	#commit(history: GameHistory) {
		const states = compute(this.history)
		this.history = history
		this.states = states
		this.onStateChange.publish()
		return states
	}
}

