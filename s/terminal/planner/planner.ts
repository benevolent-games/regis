
import {Vec2} from "@benev/toolbox"
import {Trashbin} from "@benev/slate"
import {TransformNode} from "@babylonjs/core"

import {Choice} from "../../logic/state.js"
import {Cell, TileCell} from "../parts/selectacon.js"
import {ConsiderationResult, PlannerOptions} from "./types.js"
import {doFirstValidThing} from "../../tools/do-first-valid-thing.js"
import {UnitFreedom} from "../../logic/simulation/aspects/unit-freedom.js"
import {Considerations, makeConsiderations} from "./make-considerations.js"
import {makeProposers, Proposers} from "../../logic/simulation/proposer/make-proposers.js"

export class Planner {
	proposers: Proposers
	choices: Choice.Any[] = []
	considerations: Considerations

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
	}

	render() {
		this.#renderbin.dispose()
		const {agent, assets, selectacon} = this.options
		const {indicators} = assets
		const selected = selectacon.selection.value

		for (const {place, tile} of agent.tiles.list()) {
			const target: TileCell = {
				tile,
				place,
				kind: "tile",
				position: agent.coordinator.toPosition(place),
			}

			this.navigateActionSpace({
				target,
				selected,
				on: {
					spawn: considered => makeIndicator(considered, {
						action: () => this.#instance(indicators.libertyAction, place),
						pattern: () => this.#instance(indicators.libertyPattern, place),
					}),
					attack: considered => makeIndicator(considered, {
						action: () => this.#instance(indicators.attackAction, place),
						pattern: () => this.#instance(indicators.attackPattern, place),
					}),
					movement: considered => makeIndicator(considered, {
						action: () => this.#instance(indicators.libertyAction, place),
						pattern: () => this.#instance(indicators.libertyPattern, place),
					}),
				},
			})
		}
	}

	navigateActionSpace({target, selected, on}: {
			target: Cell | null
			selected: Cell | null
			on: {
				spawn: (r: ConsiderationResult) => boolean
				attack: (r: ConsiderationResult) => boolean
				movement: (r: ConsiderationResult) => boolean
			}
		}) {

		const {agent} = this.options
		const {considerations} = this

		// focusing on a tile cell
		if (target?.kind === "tile") {

			// roster unit is already selected
			if (
				selected &&
				selected.kind === "roster" &&
				selected.teamId === agent.activeTeamIndex) {
					on.spawn(considerations.spawn(target.place, selected.unitKind))
			}

			// a tile is already selected
			else if (selected && selected.kind === "tile") {
				doFirstValidThing([
					() => on.attack(considerations.attack(selected.place, target.place)),
					() => on.movement(considerations.movement(selected.place, target.place)),
				])
			}
		}
	}
}

function makeIndicator({indicate}: ConsiderationResult, actors: {
		pattern: () => void
		action: () => void
	}) {
	if (indicate) {
		actors[indicate]()
		return true
	}
	return false
}

