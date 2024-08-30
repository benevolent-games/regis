
import {Pointing} from "./types.js"
import {Selectacon} from "./selectacon.js"
import {Agent} from "../../logic/agent.js"
import {Planner} from "../planner/planner.js"
import {ConsiderationResult} from "../planner/types.js"

export function handlePrimaryClick(options: {
		agent: Agent
		planner: Planner
		pointing: Pointing
		selectacon: Selectacon
	}) {

	const {planner, pointing, selectacon} = options
	const selected = selectacon.selection.value
	const target = selectacon.pick(pointing)

	planner.navigateActionSpace({
		target,
		selected,
		on: {
			spawn: actualize,
			attack: actualize,
			movement: actualize,
		},
	})

	selectacon.selection.value = target
}

export function actualize(result: ConsiderationResult) {
	if (result.actuate) {
		result.actuate()
		return true
	}
	return false
}

