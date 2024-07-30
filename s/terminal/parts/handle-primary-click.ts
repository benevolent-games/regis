
import {Pointing} from "./types.js"
import {Planner} from "./planner.js"
import {Selectacon} from "./selectacon.js"

export function handlePrimaryClick(options: {
		planner: Planner
		pointing: Pointing
		selectacon: Selectacon
	}) {

	const {planner, pointing, selectacon} = options
	const selection = selectacon.selection.value
	const cell = selectacon.pick(pointing)

	// clicked a tile cell
	if (cell?.kind === "tile") {

		// there is currently something selected
		if (selection) {

			// a roster unit is selected
			if (selection.kind === "roster") {
				const happened = planner.planSpawn({
					kind: "spawn",
					place: cell.place,
					unitKind: selection.unitKind,
				})
				// if (happened)
				// 	planner.executePlan()
			}

			// a tile is selected
			else if (selection.kind === "tile") {
				const happened = planner.doTheFirstValidThing([
					() => planner.planAttack({
						kind: "attack",
						source: selection.place,
						target: cell.place,
					}),
					() => planner.planMovement({
						kind: "movement",
						source: selection.place,
						target: cell.place,
					}),
				])
				// if (happened)
				// 	planner.executePlan()
			}
		}
	}

	selectacon.selection.value = cell
}

