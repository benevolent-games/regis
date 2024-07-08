
import {Action, ActionModes} from "../types.js"

export function listActions(actionCatalog: ActionModes) {
	const actionList: Action[] = []

	for (const actions of Object.values(actionCatalog)) {
		for (const action of Object.values(actions)) {
			actionList.push(action)
		}
	}

	return actionList
}

