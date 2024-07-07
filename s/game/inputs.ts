
import {Action, Input, Listener} from "../tools/inputs/types.js"

export class Device {
	#inputs: Inputs
	#actionlist: Action[]

	constructor(inputs: Inputs, actionlist: Action[]) {
		this.#inputs = inputs
		this.#actionlist = actionlist
	}

	#find(code: string) {
		return this.#actionlist.filter(
			action => action.buttons.includes(code)
		)
	}

	keydown = (event: KeyboardEvent) => {
		const actions = this.#find(event.code)
		for (const action of actions)
			this.#inputs.invoke(action, {down: true, repeat: event.repeat})
	}

	keyup = (event: KeyboardEvent) => {
		const actions = this.#find(event.code)
		for (const action of actions)
			this.#inputs.invoke(action, {down: false, repeat: event.repeat})
	}
}

export class Inputs {
	#listeners = new Map<Action, Set<Listener>>()

	on(action: Action, listener: Listener) {
		let set = this.#listeners.get(action)
		if (!set) {
			set = new Set<Listener>()
			this.#listeners.set(action, set)
		}
		set.add(listener)
		return () => set.delete(listener)
	}

	invoke(action: Action, input: Input) {
		const set = this.#listeners.get(action)
		if (set)
			for (const action of set)
				action(input)
	}
}

