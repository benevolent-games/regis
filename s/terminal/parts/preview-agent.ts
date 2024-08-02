
import {clone} from "@benev/slate"

import {ref} from "../../tools/ref.js"
import {Agent} from "../../logic/agent.js"
import {Choice} from "../../logic/state.js"
import {Proposer} from "../../logic/simulation/aspects/propose.js"

/** helps us preview the effects of a proposed turn */
export class PreviewAgent extends Agent {
	proposer: Proposer
	readonly #choices = ref<Choice.Any[]>([])

	constructor(public baseAgent: Agent) {
		super(clone(baseAgent.state))
		this.proposer = new Proposer(this)
	}

	reset() {
		this.state = clone(this.baseAgent.state)
		this.#choices.value = []
		this.proposer = new Proposer(this)
	}

	get choices() {
		return this.#choices.value
	}

	addChoice(choice: Choice.Any) {
		this.#choices.value = [...this.#choices.value, choice]
	}
}

