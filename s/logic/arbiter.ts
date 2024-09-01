
import {Agent} from "./agent.js"
import {simulateGame} from "./simulation/simulate-game.js"
import {deduceAgentState} from "./simulation/deduce-agent-state.js"
import {ArbiterState, ChronicleRecord, GameHistory, GameInitial} from "./state.js"

export class Arbiter extends Agent<ArbiterState> {
	history: GameHistory

	constructor(initial: GameInitial) {
		const history = {initial, chronicle: []}
		super(simulateGame(history))
		this.history = history
	}

	teamAgent(teamId: number) {
		return new Agent(
			deduceAgentState(this.history, this.state, teamId)
		)
	}

	commit = (record: ChronicleRecord) => {
		this.history.chronicle.push(record)
		this.state = simulateGame(this.history)
	}
}

