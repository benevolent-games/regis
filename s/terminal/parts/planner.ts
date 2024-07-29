
import {Assets} from "./assets.js"
import {Agent} from "../../logic/agent.js"
import {Selectacon} from "./selectacon.js"
import {Trashbin} from "../../tools/trashbin.js"
import {SubmitTurnFn} from "../../logic/arbiter.js"
import {Choice, Incident} from "../../logic/state.js"
import {isValidSpawnPlace} from "../../logic/routines/aspects/spawning.js"
import { getValidPath } from "../../logic/routines/aspects/movement.js"
import { TransformNode } from "@babylonjs/core"
import { Vec2 } from "@benev/toolbox"

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
		const teamId = agent.state.context.currentTurn

		if (selection) {

			// render spawning liberties
			if (selection.kind === "roster") {
				for (const {place} of agent.tiles.list()) {
					if (isValidSpawnPlace(agent, teamId, place)) {
						this.#spawn(assets.indicators.liberty, place)
					}
				}
			}

			// render movement liberties
			if (selection.kind === "tile") {
				for (const {place} of agent.tiles.list()) {
					const path = getValidPath({
						agent,
						teamId,
						source: selection.place,
						target: place,
					})
					if (path)
						this.#spawn(assets.indicators.liberty, place)
				}
			}
		}
	}

	planSpawn(choice: Choice.Spawn) {
		const {agent} = this.options
		const teamId = agent.state.context.currentTurn

		if (isValidSpawnPlace(agent, teamId, choice.place)) {
			this.plan.spawns.push(choice)
			return true
		}

		return false
	}

	planAttack(choice: Choice.Attack) {
		return false
	}

	planMovement(choice: Choice.Movement) {
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

