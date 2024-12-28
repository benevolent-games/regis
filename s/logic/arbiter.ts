
import {Agent} from "./agent.js"
import {GameSimulator} from "./simulation/game-simulator.js"
import {deduceAgentState} from "./simulation/deduce-agent-state.js"
import {ArbiterState, ChronicleRecord, GameInitial} from "./state.js"

export class Arbiter extends Agent<ArbiterState> {
	simulator: GameSimulator

	constructor(initial: GameInitial) {
		const simulator = new GameSimulator(initial)
		super(simulator.state)
		this.simulator = simulator
	}

	teamAgent(teamId: number) {
		return new Agent(
			deduceAgentState(this.simulator, this.state, teamId)
		)
	}

	commit = (record: ChronicleRecord) => {
		this.simulator.submit(record)
		this.state = this.simulator.state
	}
}

