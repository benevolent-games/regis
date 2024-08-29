
import {Trashbin} from "@benev/slate"

import {noop} from "../../tools/noop.js"
import {Choice} from "../../logic/state.js"
import {ConsiderationResult, InstanceFn, PlannerOptions} from "./types.js"
import {UnitFreedom} from "../../logic/simulation/aspects/unit-freedom.js"
import {Considerations, makeConsiderations} from "./make-considerations.js"
import {makeProposers, Proposers} from "../../logic/simulation/proposer/make-proposers.js"
import { doFirstValidThing } from "../../tools/do-first-valid-thing.js"

export class Planner {
	proposers: Proposers
	choices: Choice.Any[] = []
	considerations: Considerations

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

		this.considerations = makeConsiderations({
			plannerOptions: options,
			proposers: this.proposers,
			commit: this.#commit,
			instance: this.#instance,
		})

		this.#planbin.disposer(
			options.selectacon.selection.on(() => this.render())
		)
	}

	#instance: InstanceFn = (fn, place) => {
		const {agent} = this.options
		const instance = fn()
		const position = agent.coordinator.toPosition(place)
		instance.position.set(...position)
		this.#renderbin.disposable(instance)
		return instance
	}

	#commit = (choice: Choice.Any) => {
		this.choices.push(choice)
		this.options.agent.stateRef.publish()
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
		const {considerations} = this
		const {agent, selectacon} = this.options
		const selection = selectacon.selection.value

		if (selection) {

			// render spawning liberties
			if (selection.kind === "roster") {
				for (const {place} of agent.tiles.list()) {
					spawnIndicator(considerations.spawn(place, selection.unitKind)),
				}
			}

			if (selection.kind === "tile") {
				for (const {place} of agent.tiles.list()) {
					const source = selection.place
					const target = place
					doFirstValidThing([

						// spawn attack indicators
						() => spawnIndicator(considerations.attack(source, target)),

						// spawn movement indicators
						() => spawnIndicator(considerations.movement(source, target)),
					])
				}
			}
		}
	}
}

function spawnIndicator({indicate}: ConsiderationResult) {
	if (indicate) {
		indicate()
		return true
	}
	return false
}

