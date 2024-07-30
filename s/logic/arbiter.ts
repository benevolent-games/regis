
import {clone} from "@benev/slate"

import {Agent} from "./agent.js"
import {Ref, ref} from "../tools/ref.js"
import {compute} from "./routines/compute.js"
import {asciiMap} from "./ascii/ascii-map.js"
import {defaultGameConfig, defaultRoster, GameHistory, GameStates, Incident} from "./state.js"

export type SubmitTurnFn = (incident: Incident.Turn) => void

export class Arbiter {
	history: GameHistory
	states: Ref<GameStates>

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
		this.states = ref(compute(this.history))
	}

	makeAgent(teamId: null | number) {
		const getState = () => {
			return teamId === null
				? this.states.value.arbiter
				: this.states.value.agents[teamId]
		}
		const agent = new Agent(getState())
		const update = () => { agent.state = getState() }
		this.states.on(update)
		return agent
	}

	submitTurn: SubmitTurnFn = turn => {
		const newHistory = clone(this.history)
		newHistory.chronicle.push(turn)
		this.#commit(newHistory)
	}

	#commit(history: GameHistory) {
		this.history = history
		this.states.value = compute(this.history)
	}
}

