
import {Vec2} from "@benev/toolbox"

import {Assets} from "./parts/assets.js"
import {Selectacon} from "./selectacon.js"
import {Incident} from "../../logic/state.js"
import {Trashbin} from "../../tools/trashbin.js"
import {Agent} from "../../logic/helpers/agent.js"

export class Traversal {
	#trashbin = new Trashbin()
	#stopListening: () => void

	constructor(private options: {
			agent: Agent
			assets: Assets
			selectacon: Selectacon
			actuate: (incident: Incident.Any) => void
		}) {
		this.#stopListening = options.selectacon.onSelectionChange(() => this.render())
	}

	render() {
		this.#trashbin.dispose()

		const {agent, selectacon, assets} = this.options
		const {selection} = selectacon

		if (selection && selection.unit) {
			console.log("TODO selection")

			// // render traversal liberties
			// for (const move of findValidMoves(agent, selection.unit)) {
			// 	const instance = assets.indicators.liberty()
			// 	instance.position.set(...agent.coordinator.toPosition(move))
			// 	this.#trashbin.disposable(instance)
			// }
			//
			// // render attack indicators
			// for (const attack of findValidAttacks(agent, selection.unit)) {
			// 	const instance = assets.indicators.attack()
			// 	instance.position.set(...agent.coordinator.toPosition(attack))
			// 	this.#trashbin.disposable(instance)
			// }
		}
	}

	attemptAttack() {}

	attemptMove(placeA: Vec2, placeB: Vec2) {
		console.log("TODO attempt move")
		// const {agent, actuate} = this.options
		// if (isMovementValid(agent, placeA, placeB)) {
		// 	const [unitId] = agent.units.query(placeA)!
		// 	actuate({
		// 		kind: "action",
		// 		name: "move",
		// 		unitId,
		// 		to: placeB,
		// 	})
		// 	return true
		// }
		// else return false
	}

	dispose() {
		this.#stopListening()
		this.#trashbin.dispose()
	}
}

