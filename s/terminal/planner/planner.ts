
import {Vec2} from "@benev/toolbox"
import {Trashbin} from "@benev/slate"

import {noop} from "../../tools/noop.js"
import {Choice} from "../../logic/state.js"
import {TransformNode} from "@babylonjs/core"
import {considerSpawn} from "./considerations/spawn.js"
import {considerMovement} from "./considerations/movement.js"
import {ConsiderationOptions, PlannerOptions} from "./types.js"
import {UnitFreedom} from "../../logic/simulation/aspects/unit-freedom.js"
import {makeProposers, Proposers} from "../../logic/simulation/proposer/make-proposers.js"

export class Planner {
	proposers: Proposers
	choices: Choice.Any[] = []

	#planbin = new Trashbin()
	#renderbin = new Trashbin()
	#freedom = new UnitFreedom()

	constructor(private options: PlannerOptions) {
		const {agent, turnTracker} = this.options
		this.proposers = makeProposers({
			agent,
			turnTracker,
			freedom: this.#freedom,
		})

		this.#planbin.disposer(
			options.selectacon.selection.on(() => this.render())
		)
	}

	reset() {
		const {agent, turnTracker} = this.options
		this.#freedom.clear()
		this.proposers = makeProposers({
			agent,
			turnTracker,
			freedom: this.#freedom,
		})
		this.choices = []
	}

	#instance = (fn: () => TransformNode, place: Vec2) => {
		const {agent} = this.options
		const instance = fn()
		const position = agent.coordinator.toPosition(place)
		instance.position.set(...position)
		this.#renderbin.disposable(instance)
		return instance
	}

	consider = (() => {
		const {proposers} = this
		const consideration: ConsiderationOptions = {
			...this.options,
			proposers,
			freedom: this.#freedom,
			instance: this.#instance,
			commit: (choice: Choice.Any) => {
				this.choices.push(choice)
				this.options.agent.stateRef.publish()
			},
		}
		return {
			spawn: considerSpawn(consideration),
			movement: considerMovement(consideration),
		}
	})()

	executePlan() {
		this.options.submitTurn({choices: this.choices})
		this.reset()
	}

	dispose() {
		this.#renderbin.dispose()
		this.#planbin.dispose()
	}

	render() {
		this.#renderbin.dispose()
		const {agent, selectacon} = this.options
		const selection = selectacon.selection.value

		if (selection) {

			// render spawning liberties
			if (selection.kind === "roster") {
				for (const {place} of agent.tiles.list()) {
					const {indicate = noop} = this.consider.spawn(place, selection.unitKind)
					indicate()
				}
			}

			// render movement liberties
			if (selection.kind === "tile") {
				for (const {place} of agent.tiles.list()) {
					const {indicate = noop} = this.consider.movement(selection.place, place)
					indicate()
				}
			}
		}
	}
}

