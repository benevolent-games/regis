
import {Vec2, vec3} from "@benev/toolbox"
import {Trashbin} from "@benev/slate"
import {TransformNode} from "@babylonjs/core"

import {Choice, TeamId} from "../../logic/state.js"
import {constants} from "../../constants.js"
import {Cell, TileCell} from "../parts/selectacon.js"
import {ConsiderationResult, PlannerOptions} from "./types.js"
import {doFirstValidThing} from "../../tools/do-first-valid-thing.js"
import {Chalkboard} from "../../logic/simulation/proposer/chalkboard.js"
import {autoAttacks} from "../../logic/simulation/aspects/auto-attacks.js"
import {UnitFreedom} from "../../logic/simulation/aspects/unit-freedom.js"
import {Considerations, makeConsiderations} from "./make-considerations.js"
import {makeProposers, Proposers} from "../../logic/simulation/proposer/make-proposers.js"

export class Planner {
	freedom = new UnitFreedom()
	choices: Choice.Any[] = []
	proposers: Proposers
	considerations: Considerations

	#renderbin = new Trashbin()

	constructor(private options: PlannerOptions) {
		const {agent, turnTracker} = this.options

		this.proposers = makeProposers({
			agent,
			turnTracker,
			freedom: this.freedom,
			chalkboard: new Chalkboard(),
		})

		this.considerations = makeConsiderations({
			plannerOptions: options,
			proposers: this.proposers,
			commit: this.#commit,
		})
	}

	#instanceIndicator(fn: () => TransformNode, place: Vec2) {
		const {agent} = this.options
		const instance = fn()
		const position = vec3.add(
			agent.coordinator.toPosition(place),
			[0, constants.indicators.verticalOffsets.normalIndicators, 0],
		)
		instance.position.set(...position)
		this.#renderbin.disposable(instance)
		return instance
	}

	#commit = (choice: Choice.Any) => {
		this.choices.push(choice)
		this.options.agent.publishStateChange()
	}

	reset() {
		const {agent, turnTracker} = this.options
		this.freedom.clear()
		this.proposers = makeProposers({
			agent,
			turnTracker,
			freedom: this.freedom,
			chalkboard: new Chalkboard(),
		})
		this.choices = []
	}

	executePlan() {
		const {choices} = this
		const autoChoices = autoAttacks(this.options.agent, this.proposers, {choices})
		this.options.submitTurn({choices: [...choices, ...autoChoices]})
		this.reset()
	}

	dispose() {
		this.#renderbin.dispose()
	}

	render() {
		this.#renderbin.dispose()
		const {agent, assets, selectacon, turnTracker, spawnGhosts} = this.options

		spawnGhosts.resetPossibleGhosts()
		const {indicators} = assets
		const selected = selectacon.selection.value

		const selectedTeam = (
			(selected?.kind === "tile")
				? (agent.units.at(selected.place)?.team ?? null)
				: selected?.teamId ?? null
		)

		for (const {place} of agent.tiles.list()) {
			const target: TileCell = {
				place,
				kind: "tile",
				position: agent.coordinator.toPosition(place),
			}

			const ourTeam = turnTracker.teamId

			this.navigateActionSpace({
				target,
				selected,
				on: {
					heal: considered => makeIndicator(considered, {
						action: () => this.#instanceIndicator(() => indicators.liberty.heal(ourTeam), place),
						pattern: () => this.#instanceIndicator(() => indicators.liberty.heal(null), place),
					}),
					spawn: considered => makeIndicator(considered, {
						action: () => {
							this.#instanceIndicator(() => indicators.liberty.spawn(ourTeam), place)
							if (selected?.kind === "roster")
								spawnGhosts.setPossibleGhost({
									place,
									teamId: turnTracker.teamId,
									unitKind: selected.unitKind,
								})
						},
						pattern: () => this.#instanceIndicator(() => indicators.liberty.spawn(null), place),
					}),
					attack: considered => makeIndicator(considered, {
						action: () => this.#instanceIndicator(() => indicators.liberty.attack(ourTeam), place),
						pattern: () => this.#instanceIndicator(() => indicators.liberty.attack(null), place),
					}),
					movement: considered => makeIndicator(considered, {
						action: () => this.#instanceIndicator(() => indicators.liberty.move(ourTeam), place),
						pattern: () => this.#instanceIndicator(() => indicators.liberty.move(null), place),
					}),
				},
			})
		}
	}

	navigateActionSpace({target, selected, on}: {
			target: Cell | null
			selected: Cell | null
			on: {
				heal: (r: ConsiderationResult) => boolean
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
				selected.teamId === agent.activeTeamId) {
					on.spawn(considerations.spawn(target.place, selected.unitKind))
			}

			// a tile is already selected
			else if (selected && selected.kind === "tile") {
				doFirstValidThing([
					() => on.attack(considerations.attack(selected.place, target.place)),
					() => on.heal(considerations.heal(selected.place, target.place)),
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

