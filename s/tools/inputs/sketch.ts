
import {Action, Input, Listener, Modes} from "./types.js"

export class InputCenter<
		ActionCatalog extends Modes,
		ActionModes extends Modes
	> {

	readonly actionCatalog: ActionCatalog
	readonly actionModes: ActionModes
	readonly actionList: Action[]

	constructor(o: {
			actionCatalog: ActionCatalog
			actionModes: ActionModes
		}) {
		this.actionCatalog = o.actionCatalog
		this.actionModes = o.actionModes

		const actionList: Action[] = []

		for (const actions of Object.values(o.actionCatalog)) {
			for (const action of Object.values(actions)) {
				actionList.push(action)
			}
		}

		this.actionList = actionList
	}

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

	findAction(code: string) {
		return this.actionList.filter(
			action => action.buttons.includes(code)
		)
	}

}

