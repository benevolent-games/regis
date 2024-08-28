
import {Pointing} from "./types.js"
import {Planner} from "./planner.js"
import {Selectacon} from "./selectacon.js"
import {Agent} from "../../logic/agent.js"
import {TurnTracker} from "./turn-tracker.js"
import {doFirstValidThing} from "../../tools/do-first-valid-thing.js"
import {calculateMovement} from "../../logic/simulation/aspects/moving.js"

export function handlePrimaryClick(options: {
		agent: Agent
		planner: Planner
		pointing: Pointing
		selectacon: Selectacon
		turnTracker: TurnTracker
	}) {

	const {agent, planner, pointing, selectacon, turnTracker} = options
	const selection = selectacon.selection.value
	const cell = selectacon.pick(pointing)

	// clicked a tile cell
	if (cell?.kind === "tile") {

		// there is currently something selected
		if (selection) {

			// a roster unit is selected
			if (selection.kind === "roster")
				planner.attempt({
					kind: "spawn",
					place: cell.place,
					unitKind: selection.unitKind,
				})

			// a tile is selected
			else if (selection.kind === "tile")
				doFirstValidThing([
					() => planner.attempt({
						kind: "attack",
						source: selection.place,
						target: cell.place,
					}),
					() => {
						const unit = agent.units.at(selection.place)
						if (!unit)
							return false

						const allowed = turnTracker.canControlUnit(unit.id)
						if (!allowed)
							return false

						const movement = calculateMovement({
							agent,
							source: selection.place,
							target: cell.place,
						})

						if (movement)
							return planner.attempt({
								kind: "movement",
								source: selection.place,
								path: movement.path,
							})
						else
							return false
					},
				])
		}
	}

	selectacon.selection.value = cell
}

