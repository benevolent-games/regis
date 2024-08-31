
import {clone, Ref, ref} from "@benev/slate"

import {Agent} from "./agent.js"
import {defaultGameConfig} from "./data.js"
import {asciiMap} from "./ascii/ascii-map.js"
import {simulateGame} from "./simulation/simulate-game.js"
import {ChronicleRecord, GameHistory, GameStates, Turn} from "./state.js"

export type SubmitTurnFn = (turn: Turn) => void
export type SubmitChronicleFn = (record: ChronicleRecord) => void

export class Arbiter {
	historyRef: Ref<GameHistory>
	statesRef: Ref<GameStates>
	agent: Agent

	constructor({map}: {
			map: {
				name: string
				author: string
				ascii: string
			}
		}) {
		const {board, units, id} = asciiMap(map.ascii)
		this.historyRef = ref<GameHistory>({
			chronicle: [],
			initial: {
				id,
				board,
				units,
				config: defaultGameConfig(),
				mapMeta: {
					name: map.name,
					author: map.author,
				},
			},
		})
		this.statesRef = ref(clone(simulateGame(this.historyRef.value)))
		this.agent = this.makeAgent(null)
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

	submitTurn: SubmitChronicleFn = record => {
		const {conclusion} = this.statesRef.value.arbiter.context
		if (conclusion) {
			console.error("user submitted turn after game already ended")
			return
		}
		const newHistory = clone(this.historyRef.value)
		newHistory.chronicle.push(record)
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

