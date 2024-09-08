
import {Pointing} from "./types.js"
import {Selectacon} from "./selectacon.js"
import {Agent} from "../../logic/agent.js"
import {Planner} from "../planner/planner.js"
import {Judgement, Rebuke} from "../../logic/activities/types.js"

export function handlePrimaryClick(options: {
		agent: Agent
		planner: Planner
		pointing: Pointing
		selectacon: Selectacon
	}) {

	const {planner, pointing, selectacon} = options
	const selected = selectacon.selection.value
	const target = selectacon.pick(pointing)

	function actuate(fn: () => void) {
		return (judgement: Rebuke | Judgement) => {
			if (judgement instanceof Rebuke)
				return undefined
			planner.schedule(judgement)
			fn()
		}
	}

	planner.navigateActionSpace({
		target,
		selected,
		on: {
			attack: actuate(() => {}),
			heal: actuate(() => {}),
			recruit: actuate(() => {}),
			movement: actuate(() => { selectacon.selection.value = target }),
		},
	})
}

