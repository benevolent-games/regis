
import {Vec2} from "@benev/toolbox"
import {Trashbin} from "@benev/slate"
import {TransformNode} from "@babylonjs/core"

import {Choice} from "../../logic/state.js"
import {ConsiderationResult, PlannerOptions} from "./types.js"
import {doFirstValidThing} from "../../tools/do-first-valid-thing.js"
import {UnitFreedom} from "../../logic/simulation/aspects/unit-freedom.js"
import {Considerations, makeConsiderations} from "./make-considerations.js"
import {makeProposers, Proposers} from "../../logic/simulation/proposer/make-proposers.js"

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
		})

		this.#planbin.disposer(
			options.selectacon.selection.on(() => this.render())
		)
	}

	#instance(fn: () => TransformNode, place: Vec2) {
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
		const {agent, assets, selectacon} = this.options
		const {indicators} = assets
		const selection = selectacon.selection.value

		if (selection) {

			// render spawning liberties
			if (selection.kind === "roster") {
				for (const {place} of agent.tiles.list()) {
					spawnIndicator(considerations.spawn(place, selection.unitKind), {
						action: () => this.#instance(indicators.libertyAction, place),
						pattern: () => this.#instance(indicators.libertyPattern, place),
					})
				}
			}

			if (selection.kind === "tile") {
				for (const {place} of agent.tiles.list()) {
					const source = selection.place
					const target = place
					doFirstValidThing([

						// spawn attack indicators
						() => spawnIndicator(considerations.attack(source, target), {
							action: () => this.#instance(indicators.attackAction, place),
							pattern: () => this.#instance(indicators.attackPattern, place),
						}),

						// spawn movement indicators
						() => spawnIndicator(considerations.movement(source, target), {
							action: () => this.#instance(indicators.libertyAction, place),
							pattern: () => this.#instance(indicators.libertyPattern, place),
						}),
					])
				}
			}
		}
	}
}

function spawnIndicator({indicate}: ConsiderationResult, actors: {
		pattern: () => void
		action: () => void
	}) {
	if (indicate) {
		actors[indicate]()
		return true
	}
	return false
}

