
import {clone} from "@benev/slate"

import {ref} from "../../tools/ref.js"
import {Agent} from "../../logic/agent.js"
import {Choice} from "../../logic/state.js"
import {Trashbin} from "../../tools/trashbin.js"
import {applyTurn} from "../../logic/routines/patch.js"

export class PreviewAgent extends Agent {
	readonly #bin = new Trashbin()
	readonly #choices = ref<Choice.Any[]>([])

	constructor(public baseAgent: Agent) {
		super(clone(baseAgent.state))
		this.#bin.disposer(baseAgent.stateRef.on(() => this.#update()))
		this.#bin.disposer(this.#choices.on(() => {
			console.log("update update update")
			this.#update()
		}))
	}

	get choices() {
		return this.#choices.value
	}

	addChoice(choice: Choice.Any) {
		console.log("addChoice")
		this.#choices.value = [...this.#choices.value, choice]
	}

	clearChoices() {
		console.log("clearChoices")
		this.#choices.value = []
	}

	#update() {
		console.log("preview update!")
		const state = clone(this.baseAgent.state)
		const choices = this.#choices.value
		applyTurn(state, {choices})
		this.state = state
	}

	dispose() {
		this.#bin.dispose()
	}
}

