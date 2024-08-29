
import {Pointing} from "./types.js"
import {Selectacon} from "./selectacon.js"
import {Agent} from "../../logic/agent.js"
import {Planner} from "../planner/planner.js"
import {ConsiderationResult} from "../planner/types.js"
import {doFirstValidThing} from "../../tools/do-first-valid-thing.js"

export function handlePrimaryClick(options: {
		agent: Agent
		planner: Planner
		pointing: Pointing
		selectacon: Selectacon
	}) {

	const {agent, planner, pointing, selectacon} = options
	const alreadySelected = selectacon.selection.value
	const clickedCell = selectacon.pick(pointing)

	// clicked a tile cell
	if (clickedCell?.kind === "tile") {

		// there is something previously selected
		if (alreadySelected) {

			// a roster unit is already selected
			if (alreadySelected.kind === "roster" && alreadySelected.teamId === agent.activeTeamIndex) {
				actualize(
					planner.considerations.spawn(clickedCell.place, alreadySelected.unitKind)
				)
			}

			// a tile is selected
			else if (alreadySelected.kind === "tile") {
				doFirstValidThing([
					() => actualize(
						planner.considerations.attack(alreadySelected.place, clickedCell.place)
					),
					() => actualize(
						planner.considerations.movement(alreadySelected.place, clickedCell.place)
					),
				])
			}
		}
	}

	selectacon.selection.value = clickedCell
}

export function actualize(result: ConsiderationResult) {
	if (result.actuate) {
		result.actuate()
		return true
	}
	return false
}

