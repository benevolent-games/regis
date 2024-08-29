
import {Vec2} from "@benev/toolbox"
import {Trashbin} from "@benev/slate"
import {TransformNode} from "@babylonjs/core"

import {Assets} from "./assets.js"
import {Selectacon} from "./selectacon.js"
import {Agent} from "../../logic/agent.js"
import {Choice} from "../../logic/state.js"
import {SubmitTurnFn} from "../../logic/arbiter.js"
import {Proposer} from "../../logic/simulation/proposer.js"
import {Denial, WrongTeamDenial} from "../../logic/simulation/aspects/denials.js"
import {TurnTracker} from "../../logic/simulation/aspects/turn-tracker.js"
import {calculateMovement} from "../../logic/simulation/aspects/moving.js"

/** interface for the user to sketch a plan for their turn */
export class Planner {
	#planbin = new Trashbin()
	#renderbin = new Trashbin()

	proposer: Proposer
	choices: Choice.Any[] = []

	constructor(private options: {
			agent: Agent
			assets: Assets
			selectacon: Selectacon
			turnTracker: TurnTracker
			submitTurn: SubmitTurnFn
		}) {

		const {agent, turnTracker} = this.options
		this.proposer = new Proposer(agent, turnTracker)

		this.#planbin.disposer(
			options.selectacon.selection.on(() => this.render())
		)
	}

	reset() {
		const {agent, turnTracker} = this.options
		this.proposer = new Proposer(agent, turnTracker)
		this.choices = []
	}

	#spawn(fn: () => TransformNode, place: Vec2) {
		const {agent} = this.options
		const instance = fn()
		const position = agent.coordinator.toPosition(place)
		instance.position.set(...position)
		this.#renderbin.disposable(instance)
		return instance
	}

	render() {
		this.#renderbin.dispose()
		const {proposer} = this
		const {agent, selectacon, assets} = this.options
		const selection = selectacon.selection.value

		if (selection) {

			// render spawning liberties
			if (selection.kind === "roster") {
				for (const {place} of agent.tiles.list()) {
					const report = proposer.propose.spawn({
						kind: "spawn",
						place,
						unitKind: selection.unitKind,
					})
					if (report instanceof WrongTeamDenial)
						this.#spawn(assets.indicators.libertyPattern, place)
					else if (!(report instanceof Denial))
						this.#spawn(assets.indicators.libertyAction, place)
				}
			}

			// render movement liberties
			if (selection.kind === "tile") {
				const unit = agent.units.at(selection.place)
				if (unit) {
					const archetype = agent.archetype(unit.kind)
					const {canMove} = proposer.unitFreedom.report(unit.id, archetype)
					if (canMove) {
						for (const {place} of agent.tiles.list()) {
							const movement = calculateMovement({
								agent,
								source: selection.place,
								target: place,
							})
							if (movement) {
								const report = proposer.propose.movement({
									kind: "movement",
									source: movement.source,
									path: movement.path,
								})
								if (report instanceof WrongTeamDenial)
									this.#spawn(assets.indicators.libertyPattern, place)
								else if (!(report instanceof Denial))
									this.#spawn(assets.indicators.libertyAction, place)
							}
						}
					}
				}
			}
		}
	}

	attempt(choice: Choice.Any) {
		const {agent} = this.options
		if (agent.conclusion)
			return false

		const fn = this.proposer.propose[choice.kind] as any
		const report = fn(choice)
		if (report instanceof Denial)
			return false

		this.choices.push(choice)
		report.commit()
		return true
	}

	executePlan() {
		this.options.submitTurn({choices: this.choices})
		this.reset()
	}

	dispose() {
		this.#renderbin.dispose()
		this.#planbin.dispose()
	}
}

