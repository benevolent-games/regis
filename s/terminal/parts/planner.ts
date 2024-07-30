
import {Vec2} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core"

import {Assets} from "./assets.js"
import {Selectacon} from "./selectacon.js"
import {Choice} from "../../logic/state.js"
import {PreviewAgent} from "./preview-agent.js"
import {Trashbin} from "../../tools/trashbin.js"
import {SubmitTurnFn} from "../../logic/arbiter.js"
import {propose} from "../../logic/routines/aspects/propose.js"

export class Planner {
	#rendertrash = new Trashbin()
	#plannertrash = new Trashbin()

	constructor(private options: {
			assets: Assets
			agent: PreviewAgent
			selectacon: Selectacon
			submitTurn: SubmitTurnFn
		}) {

		this.#plannertrash.disposer(
			options.selectacon.selection.on(() => this.render())
		)
	}

	#spawn(fn: () => TransformNode, place: Vec2) {
		const {agent} = this.options
		const instance = fn()
		const position = agent.coordinator.toPosition(place)
		instance.position.set(...position)
		this.#rendertrash.disposable(instance)
		return instance
	}

	render() {
		this.#rendertrash.dispose()
		const {agent, selectacon, assets} = this.options
		const selection = selectacon.selection.value

		if (selection) {

			// render spawning liberties
			if (selection.kind === "roster") {
				Array.from(agent.tiles.list())
					.filter(({place}) => !!propose(agent).spawn({
						kind: "spawn",
						place,
						unitKind: selection.unitKind,
					}))
					.forEach(({place}) => {
						this.#spawn(assets.indicators.liberty, place)
					})
			}

			// render movement liberties
			if (selection.kind === "tile") {
				Array.from(agent.tiles.list())
					.filter(({place}) => !!propose(agent).movement({
						kind: "movement",
						source: selection.place,
						target: place,
					}))
					.forEach(({place}) => {
						this.#spawn(assets.indicators.liberty, place)
					})
			}
		}
	}

	planSpawn(choice: Choice.Spawn) {
		const {agent} = this.options
		if (propose(agent).spawn(choice)) {
			agent.addChoice(choice)
			return true
		}
		return false
	}

	planMovement(choice: Choice.Movement) {
		console.log("plan movement")
		const {agent} = this.options
		if (propose(this.options.agent).movement(choice)) {
			console.log("proposed movement")
			agent.addChoice(choice)
			return true
		}
		return false
	}

	planAttack(choice: Choice.Attack) {
		return false
	}

	planInvestment(choice: Choice.Investment) {
		return false
	}

	doTheFirstValidThing(fns: (() => boolean)[]) {
		for (const fn of fns) {
			const result = fn()
			if (result)
				return result
		}
		return false
	}

	executePlan() {
		this.options.submitTurn({
			kind: "turn",
			choices: this.options.agent.choices,
		})
		this.options.agent.clearChoices()
	}

	dispose() {
		this.#rendertrash.dispose()
		this.#plannertrash.dispose()
	}
}

