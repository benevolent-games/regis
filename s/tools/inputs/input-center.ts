
import {ev, Signal, signal} from "@benev/slate"
import {Action, Input, Listener, ActionModes} from "./types.js"

export class InputCenter<AC extends ActionModes, A extends ActionModes> {
	readonly mode: Signal<keyof A>

	#actionSet = new Set<Action>()
	#listeners = new Map<Action, Set<Listener>>()

	constructor(
			public readonly actionCatalog: AC,
			public readonly actionModes: A,
			startMode: keyof A,
		) {

		this.mode = signal(startMode)

		for (const actionGroup of Object.values(actionModes)) {
			for (const action of Object.values(actionGroup)) {
				this.#actionSet.add(action)
			}
		}
	}

	get actions() {
		return this.actionModes[this.mode.value]
	}

	/** listen for an action input */
	on(action: Action, listener: Listener) {
		let set = this.#listeners.get(action)
		if (!set) {
			set = new Set<Listener>()
			this.#listeners.set(action, set)
		}
		set.add(listener)
		return () => set.delete(listener)
	}

	/** invoke an action with the given input */
	invoke(input: Input) {
		const set = this.#listeners.get(input.action)
		if (set)
			for (const action of set)
				action(input)
	}

	/** find an action by its code, eg, "KeyQ" or "Touch1" */
	find(code: string) {
		return Object.values(this.actions)
			.filter(action => action.codes.includes(code))
	}

	/** listen to keyboard events to invoke action inputs */
	listenForKeyboardEvents(target: EventTarget) {
		return ev(target, {

			keydown: (event: KeyboardEvent) => {
				const actions = this.find(event.code)
				for (const action of actions)
					this.invoke({action, down: true, repeat: event.repeat})
			},

			keyup: (event: KeyboardEvent) => {
				const actions = this.find(event.code)
				for (const action of actions)
					this.invoke({action, down: false, repeat: event.repeat})
			},
		})
	}
}

