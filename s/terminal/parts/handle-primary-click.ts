
import {Pointing} from "./types.js"
import {Planner} from "./planner.js"
import {Selectacon} from "./selectacon.js"
import {doFirstValidThing} from "../../tools/do-first-valid-thing.js"

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
				planner.attempt({
					kind: "spawn",
					place: cell.place,
					unitKind: selection.unitKind,
				})
			}

			// a tile is selected
			else if (selection.kind === "tile") {
				doFirstValidThing([
					() => planner.attempt({
						kind: "attack",
						source: selection.place,
						target: cell.place,
					}),
					() => planner.attempt({
						kind: "movement",
						source: selection.place,
						target: cell.place,
					}),
				])
			}
		}
	}

	selectacon.selection.value = cell
}

