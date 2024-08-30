
import {Trashbin} from "@benev/slate"

import {Assets} from "./assets.js"
import {Agent} from "../../logic/agent.js"
import {UnitKind} from "../../logic/state.js"
import { getBestHealthbar } from "./healthbars.js"
import { loop } from "@benev/toolbox"
import { getChildProps } from "./babylon-helpers.js"

export const unitKindsWithHealthRing: UnitKind[] = [
	"king",
	"pawn",
	"knight",
	"rook",
	"bishop",
	"queen",
]

export class UnitVisuals {
	#trashbin = new Trashbin()

	constructor(private agent: Agent, private assets: Assets) {}

	render() {
		this.#trashbin.dispose()
		const d = this.#trashbin.disposable
		const {agent, assets} = this

		// instantiate units
		for (const unit of agent.units.list()) {
			const instancer = assets.units.unit.get(unit.kind)
			if (!instancer)
				throw new Error(`cannot spawn unknown unit kind "${unit.kind}"`)
			const instance = d(instancer(unit.team))
			instance.position.set(...agent.coordinator.toPosition(unit.place))
		}

		// instantiate unit health bars
		for (const unit of agent.units.list()) {
			const hasHealthRing = unitKindsWithHealthRing.includes(unit.kind)
			const archetype = agent.archetype(unit.kind)

			if (hasHealthRing && archetype.health) {
				const healthAmount = archetype.health - unit.damage
				const healthFraction = healthAmount / archetype.health
				const position = agent.coordinator.toPosition(unit.place)

				const ring = d(assets.units.ring())
				ring.position.set(...position)

				const healthbar = getBestHealthbar(healthFraction)
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

