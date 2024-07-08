
import {ev} from "@benev/slate"
import {listActions} from "./utils/list-actions.js"
import {Action, Input, Listener, ActionModes} from "./types.js"

export class InputCenter<
		Catalog extends ActionModes,
		Modes extends ActionModes,
	> {

	#listeners = new Map<Action, Set<Listener>>()

	/** flat list of all actions */
	readonly actionList: Action[]

	constructor(

			/** full catalog of all actions laid into groups */
			public readonly catalog: Catalog,

			/** actions organized into modes, some actions may be in multiple modes */
			public readonly modes: Modes,

		) {
		this.actionList = listActions(catalog)
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
	findAction(code: string) {
		return this.actionList.filter(
			action => action.codes.includes(code)
		)
	}

	/** listen to keyboard events to invoke action inputs */
	listenForKeyboardEvents(target: EventTarget) {
		return ev(target, {
			keydown: (event: KeyboardEvent) => {
				const actions = this.findAction(event.code)
				for (const action of actions)
					this.invoke({action, down: true, repeat: event.repeat})
			},
			keyup: (event: KeyboardEvent) => {
				const actions = this.findAction(event.code)
				for (const action of actions)
					this.invoke({action, down: false, repeat: event.repeat})
			},
		})
	}
}

