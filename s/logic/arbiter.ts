
import {clone, Ref, ref} from "@benev/slate"

import {Agent} from "./agent.js"
import {defaultGameConfig} from "./data.js"
import {asciiMap} from "./ascii/ascii-map.js"
import {GameHistory, GameStates, Turn} from "./state.js"
import {simulateGame} from "./simulation/simulate-game.js"
import {activeTeamIndex} from "./simulation/aspects/turns.js"

export type SubmitTurnFn = (turn: Turn) => void

export class Arbiter {
	historyRef: Ref<GameHistory>
	statesRef: Ref<GameStates>

	constructor({map}: {
			map: {
				name: string
				author: string
				ascii: string
			}
		}) {
		const {board, units, id} = asciiMap(map.ascii)
		this.historyRef = ref<GameHistory>({
			turns: [],
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
		const {conclusion} = this.statesRef.value.arbiter.context
		if (conclusion) {
			console.error("user submitted turn after game already ended")
			return
		}
		const newHistory = clone(this.historyRef.value)
		newHistory.turns.push(turn)
		this.#commit(newHistory)
	}

	getAgentState(teamId: number) {
		return this.statesRef.value.agents.at(teamId)!
	}

	get activeTeamIndex() {
		return activeTeamIndex(this.statesRef.value.arbiter)
	}

	#commit(history: GameHistory) {
		this.historyRef.value = history
		this.statesRef.value = clone(simulateGame(this.historyRef.value))
	}
}

