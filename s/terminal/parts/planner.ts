
import {Vec2} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core"

import {Assets} from "./assets.js"
import {Selectacon} from "./selectacon.js"
import {Choice} from "../../logic/state.js"
import {PreviewAgent} from "./preview-agent.js"
import {Trashbin} from "../../tools/trashbin.js"
import {SubmitTurnFn} from "../../logic/arbiter.js"

/** interface for the user to sketch a plan for their turn */
export class Planner {
	#planbin = new Trashbin()
	#renderbin = new Trashbin()

	constructor(private options: {
			assets: Assets
			agent: PreviewAgent // uses a preview agent instead of just an agent
			selectacon: Selectacon
			submitTurn: SubmitTurnFn
		}) {

		this.#planbin.disposer(
			options.selectacon.selection.on(() => this.render())
		)
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
		const {agent, selectacon, assets} = this.options
		const {proposition} = agent
		const selection = selectacon.selection.value

		if (selection) {

			// render spawning liberties
			if (selection.kind === "roster" && selection.teamId === agent.currentTurn)
				Array
					.from(agent.tiles.list())
					.filter(({place}) => !!proposition.spawn({
						kind: "spawn",
						place,
						unitKind: selection.unitKind,
					}))
					.forEach(({place}) => {
						this.#spawn(assets.indicators.liberty, place)
					})

			// render movement liberties
			if (selection.kind === "tile")
				Array
					.from(agent.tiles.list())
					.filter(({place}) => !!proposition.movement({
						kind: "movement",
						source: selection.place,
						target: place,
					}))
					.forEach(({place}) => {
						this.#spawn(assets.indicators.liberty, place)
					})
		}
	}

	attempt(choice: Choice.Any) {
		const {agent} = this.options
		const fn = agent.proposition[choice.kind] as any
		const report = fn(choice)
		if (report) {
			agent.addChoice(choice)
			report.commit()
			return true
		}
		return false
	}

	executePlan() {
		const {agent, submitTurn} = this.options
		submitTurn({
			kind: "turn",
			choices: agent.choices,
		})
		agent.reset()
	}

	dispose() {
		this.#renderbin.dispose()
		this.#planbin.dispose()
	}
}

