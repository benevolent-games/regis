
import {Trashbin} from "@benev/slate"
import {loop, Vec2} from "@benev/toolbox"

import {Agent} from "../../logic/agent.js"
import {Assets} from "../assets/assets.js"
import {getBestHealthbar} from "./healthbars.js"
import {getChildProps} from "./babylon-helpers.js"
import {healthReport} from "../../logic/utils/health-report.js"

export class UnitVisuals {
	#trashbin = new Trashbin()

	constructor(private agent: Agent, private assets: Assets) {}

	render() {
		this.#trashbin.dispose()
		const d = this.#trashbin.disposable
		const {agent, assets} = this

		// instantiate units
		for (const unit of agent.units.list()) {
			const instance = d(assets.units.unit(
				unit.kind,
				unit.team,
				healthReport(unit, agent.archetype(unit.kind)),
			))
			instance.position.set(...agent.coordinator.toPosition(Vec2.from(unit.place)).array())
		}

		// instantiate unit health bars
		for (const unit of agent.units.list()) {
			const archetype = agent.archetype(unit.kind)
			const health = healthReport(unit, archetype)

			if (health) {
				const position = agent.coordinator.toPosition(Vec2.from(unit.place))

				const ring = d(assets.units.ring())
				ring.position.set(...position.array())

				const healthbar = getBestHealthbar(health.fraction)
				const ringChildren = getChildProps(ring)

				for (const index of loop(24)) {
					const n = index + 1
					const healthy = healthbar.segments.at(index)!
					if (healthy) {
						ringChildren.get(`ring-a${n}`)!.dispose()
						ringChildren.get(`ring-b${n}`)!.dispose()
						ringChildren.get(`ring-c${n}`)!.dispose()
					}
				}
			}
		}
	}

	dispose() {
		this.#trashbin.dispose()
	}
}

