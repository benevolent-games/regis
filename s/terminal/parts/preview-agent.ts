
import {clone} from "@benev/slate"

import {ref} from "../../tools/ref.js"
import {Agent} from "../../logic/agent.js"
import {Choice} from "../../logic/state.js"
import {Trashbin} from "../../tools/trashbin.js"
import {simulateTurn} from "../../logic/routines/simulate-turn.js"
import {propose, Proposition} from "../../logic/routines/aspects/propose.js"

export class PreviewAgent extends Agent {
	readonly #bin = new Trashbin()
	readonly #choices = ref<Choice.Any[]>([])

	proposition: Proposition

	constructor(public baseAgent: Agent) {
		super(clone(baseAgent.state))
		this.#bin.disposer(baseAgent.stateRef.on(() => this.#update()))
		this.#bin.disposer(this.#choices.on(() => this.#update()))
		this.proposition = propose(this)
	}

	get choices() {
		return this.#choices.value
	}

	addChoice(choice: Choice.Any) {
		this.#choices.value = [...this.#choices.value, choice]
	}

	clearChoices() {
		this.#choices.value = []
		this.proposition = propose(this)
	}

	#update() {
		const state = clone(this.baseAgent.state)
		const choices = this.#choices.value
		simulateTurn(state, {choices})
		this.state = state
	}

	dispose() {
		this.#bin.dispose()
	}
}

