
import {Assets} from "./assets.js"
import {Agent} from "../../logic/agent.js"
import {Selectacon} from "./selectacon.js"
import {Trashbin} from "../../tools/trashbin.js"
import {SubmitTurnFn} from "../../logic/arbiter.js"
import {Choice, Incident} from "../../logic/state.js"
import {isValidSpawnPlace} from "../../logic/routines/aspects/spawning.js"

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

	render() {
		this.#rendertrash.dispose()

		const {agent, selectacon, assets} = this.options
		const selection = selectacon.selection.value
		const teamId = agent.state.context.currentTurn

		if (selection) {

			// render spawning liberties
			if (selection.kind === "roster") {
				console.log("select roster")
				for (const {place} of agent.tiles.list()) {
					if (isValidSpawnPlace(agent, teamId, place)) {
						const instance = assets.indicators.liberty()
						instance.position.set(...agent.coordinator.toPosition(place))
						this.#rendertrash.disposable(instance)
					}
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

	planAttack(choice: Choice.Attack) {}

	planMovement(choice: Choice.Movement) {}

	planInvestment(choice: Choice.Investment) {}

	executePlan() {
		this.options.submitTurn(this.plan)
		this.plan = createBlankTurn()
	}
}

