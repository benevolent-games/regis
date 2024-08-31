
import {pubsub} from "@benev/slate"

import {Agent} from "./agent.js"
import {simulateGame} from "./simulation/simulate-game.js"
import {deduceAgentState} from "./simulation/deduce-agent-state.js"
import {ArbiterState, ChronicleRecord, GameHistory, GameInitial} from "./state.js"

export class Arbiter {
	history: GameHistory
	#state: ArbiterState

	onStateChange = pubsub<[ArbiterState]>()

	get state() {
		return this.#state
	}

	set state(state: ArbiterState) {
		this.#state = state
		this.onStateChange.publish(state)
	}

	constructor(initial: GameInitial) {
		this.history = {initial, chronicle: []}
		this.#state = simulateGame(this.history)
	}

	submitTurn = (record: ChronicleRecord) => {
		this.history.chronicle.push(record)
		this.state = simulateGame(this.history)
	}

	get agent() {
		return new Agent(this.state)
	}

	teamAgent(teamId: number) {
		return new Agent(
			deduceAgentState(this.history, this.state, teamId)
		)
	}
}

