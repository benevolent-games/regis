
import {clone} from "@benev/slate"

import {Agent} from "./agent.js"
import {Ref, ref} from "../tools/ref.js"
import {asciiMap} from "./ascii/ascii-map.js"
import {simulateGame} from "./simulation/simulate-game.js"
import {defaultGameConfig, defaultRoster, GameHistory, GameStates, Turn} from "./state.js"

export type SubmitTurnFn = (turn: Turn) => void

export class Arbiter {
	historyRef: Ref<GameHistory>
	statesRef: Ref<GameStates>

	constructor(ascii: string) {
		const {board, units} = asciiMap(ascii)
		this.historyRef = ref<GameHistory>({
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
		})
		this.statesRef = ref(clone(simulateGame(this.historyRef.value)))
	}

	makeAgent(teamId: null | number) {
		const getState = () => {
			return teamId === null
				? this.statesRef.value.arbiter
				: this.statesRef.value.agents[teamId]
		}
		const agent = new Agent(getState())
		const update = () => { agent.state = getState() }
		this.statesRef.on(update)
		return agent
	}

	submitTurn: SubmitTurnFn = turn => {
		const newHistory = clone(this.historyRef.value)
		newHistory.chronicle.push(turn)
		this.#commit(newHistory)
	}

	getAgentState(teamId: number) {
		return this.statesRef.value.agents.at(teamId)!
	}

	#commit(history: GameHistory) {
		this.historyRef.value = history
		this.statesRef.value = clone(simulateGame(this.historyRef.value))
	}
}

