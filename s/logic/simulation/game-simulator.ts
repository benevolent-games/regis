
import {deep} from "@benev/slate"
import {applyWinByElimination} from "./aspects/turns.js"
import {simulateTurn} from "./simulants/simulate-turn.js"
import {initializeArbiterState} from "./simulants/initialize-arbiter-state.js"
import {ArbiterState, ChronicleRecord, GameHistory, GameInitial} from "../state.js"

export class GameSimulator implements GameHistory {
	#state: ArbiterState
	#chronicle: ChronicleRecord[] = []

	constructor(public initial: GameInitial) {
		this.#state = initializeArbiterState(initial)
	}

	get state() {
		return deep.clone(this.#state)
	}

	get chronicle() {
		return deep.clone(this.#chronicle)
	}

	get conclusion() {
		return this.#state.context.conclusion
	}

	submit(record: ChronicleRecord) {
		const state = this.#state
		switch (record.kind) {

			case "turn":
				simulateTurn(state, record.turn)
				break

			case "timeExpired":
				applyWinByElimination(state, record.eliminatedTeamId, "timeExpired")
				break

			case "surrender":
				applyWinByElimination(state, record.eliminatedTeamId, "timeExpired")
				break

			default:
				throw new Error(`unknown chronicle entry kind`)
		}

		
		return this.#state.context
	}
}

