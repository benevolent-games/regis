
import {Pointing} from "./types.js"
import {Planner} from "./planner.js"
import {Cell, Selectacon} from "./selectacon.js"

export function handlePrimaryClick(options: {
		planner: Planner
		pointing: Pointing
		selectacon: Selectacon
	}) {

	const {planner, pointing, selectacon} = options
	const selection = selectacon.selection.value
	const cell = selectacon.pick(pointing)
	const setSelection = (cell: Cell | null) => {
		selectacon.selection.value = cell
	}

	// clicked a tile cell
	if (cell?.kind === "tile") {

		// there is currently something selected
		if (selection) {

			// a roster unit is selected
			if (selection.kind === "roster") {
				planner.planSpawn({
					place: cell.place,
					unitKind: selection.unitKind,
				})
				setSelection(cell)
			}

			// a tile is selected
			else if (selection.kind === "tile") {
				planner.doTheFirstValidThing([
					() => planner.planAttack({
						source: selection.place,
						target: cell.place,
					}),
					() => planner.planMovement({
						source: selection.place,
						target: cell.place,
					}),
				])
				setSelection(cell)
			}
		}

		// nothing is currently selected
		else {
			setSelection(cell)
		}
	}

	// clicked a roster unit
	else if (cell?.kind === "roster") {
		setSelection(cell)
	}

	// clicked nothing
	else {
		setSelection(null)
	}
}

