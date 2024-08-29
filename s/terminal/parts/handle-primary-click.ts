
import {Pointing} from "./types.js"
import {noop} from "../../tools/noop.js"
import {Selectacon} from "./selectacon.js"
import {Agent} from "../../logic/agent.js"
import {Planner} from "../planner/planner.js"
import {doFirstValidThing} from "../../tools/do-first-valid-thing.js"
import {TurnTracker} from "../../logic/simulation/aspects/turn-tracker.js"

export function handlePrimaryClick(options: {
		agent: Agent
		planner: Planner
		pointing: Pointing
		selectacon: Selectacon
		turnTracker: TurnTracker
	}) {

	const {agent, planner, pointing, selectacon, turnTracker} = options
	const alreadySelected = selectacon.selection.value
	const clickedCell = selectacon.pick(pointing)

	// clicked a tile cell
	if (clickedCell?.kind === "tile") {

		// there is something previously selected
		if (alreadySelected) {

			// a roster unit is already selected
			if (alreadySelected.kind === "roster" && alreadySelected.teamId === agent.activeTeamIndex) {
				const {actuate = noop} = planner.consider.spawn(clickedCell.place, alreadySelected.unitKind)
				actuate()
			}

			// a tile is selected
			else if (alreadySelected.kind === "tile") {
				// const sourceUnit = agent.units.at(alreadySelected.place)
				// const sourceUnitIsControllable = (
				// 	sourceUnit &&
				// 	turnTracker.teamIndex === sourceUnit.team
				// )

				doFirstValidThing([
					// () => {
					// 	// const {commit = noop} = planner.consider.attack(clickedCell.place, alreadySelected.unitKind)
					//
					// 	if (!sourceUnitIsControllable)
					// 		return false
					// 	return planner.attempt({
					// 		kind: "attack",
					// 		source: alreadySelected.place,
					// 		target: clickedCell.place,
					// 	})
					// },
					() => {
						const {actuate} = planner.consider.movement(alreadySelected.place, clickedCell.place)
						if (!actuate)
							return false
						actuate()
						return true

						// if (!sourceUnitIsControllable)
						// 	return false
						// const movement = calculateMovement({
						// 	agent,
						// 	source: alreadySelected.place,
						// 	target: clickedCell.place,
						// })
						// if (movement)
						// 	return planner.attempt({
						// 		kind: "movement",
						// 		source: alreadySelected.place,
						// 		path: movement.path,
						// 	})
						// else
						// 	return false
					},
				])
			}
		}
	}

	selectacon.selection.value = clickedCell
}

