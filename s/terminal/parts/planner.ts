
import {Vec2} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core"

import {Assets} from "./assets.js"
import {Agent} from "../../logic/agent.js"
import {Selectacon} from "./selectacon.js"
import {Trashbin} from "../../tools/trashbin.js"
import {SubmitTurnFn} from "../../logic/arbiter.js"
import {Choice, Incident} from "../../logic/state.js"
import {propose} from "../../logic/routines/aspects/propose.js"

function createBlankTurn(): Incident.Turn {
	return {
		kind: "turn",
		spawns: [],
		attacks: [],
		movements: [],
		investments: [],
	}
}

export class Planner {
	#rendertrash = new Trashbin()
	#plannertrash = new Trashbin()

	plan = createBlankTurn()

	dispose() {
		this.#rendertrash.dispose()
		this.#plannertrash.dispose()
	}

	constructor(private options: {
			agent: Agent
			assets: Assets
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
		console.log("plan spawn")
		if (propose(this.options.agent).spawn(choice)) {
			console.log("big proppa")
			this.plan.spawns.push(choice)
			return true
		}
		return false
	}

	planAttack(choice: Choice.Attack) {
		return false
	}

	planMovement(choice: Choice.Movement) {
		if (propose(this.options.agent).movement(choice)) {
			this.plan.movements.push(choice)
			return true
		}
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
		this.options.submitTurn(this.plan)
		this.plan = createBlankTurn()
	}
}

