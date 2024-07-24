
import {Vec2} from "@benev/toolbox"

import {Assets} from "./parts/assets.js"
import {Agent} from "../../logic/agent.js"
import {Selectacon} from "./selectacon.js"
import {Trashbin} from "../../tools/trashbin.js"
import {Incident} from "../../logic/state/game.js"
import {findValidMoves, isMovementValid} from "../../logic/arbitration/routines.js"

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
			for (const move of findValidMoves(agent, selection.unit)) {
				const instance = assets.indicators.liberty()
				instance.position.set(...agent.coordinator.toPosition(move))
				this.#trashbin.disposable(instance)
			}
		}
	}

	attemptMove(placeA: Vec2, placeB: Vec2) {
		const {agent, actuate} = this.options
		if (isMovementValid(agent, placeA, placeB)) {
			const [unitId] = agent.units.query(placeA)!
			actuate({
				kind: "action",
				name: "move",
				unitId,
				to: placeB,
			})
			return true
		}
		else return false
	}

	dispose() {
		this.#stopListening()
		this.#trashbin.dispose()
	}
}

