
import {Trashbin} from "@benev/slate"
import {Quaternion} from "@babylonjs/core"
import {Degrees, Vec2} from "@benev/toolbox"

import {Assets} from "../assets/assets.js"
import {Agent} from "../../logic/agent.js"
import {cardinals} from "../../logic/simulation/aspects/navigation.js"
import {limitedVision} from "../../logic/simulation/aspects/vision.js"
import {TurnTracker} from "../../logic/simulation/aspects/turn-tracker.js"

export class FogFenceRenderer {
	#trash = new Trashbin()

	constructor(private options: {
		agent: Agent
		assets: Assets
		turnTracker: TurnTracker
	}) {}

	render() {
		this.#trash.dispose()
		const d = this.#trash.disposable
		const {agent, assets, turnTracker} = this.options

		const vision = limitedVision(agent.state, turnTracker.teamId)
		const inVision = (place: Vec2) => vision.some(v => v.equals(place))

		for (const place of vision) {
			for (const [index, cardinal] of cardinals.entries()) {
				const neighbor = place.clone().add(cardinal)
				if (agent.tiles.valid(neighbor) && !inVision(neighbor)) {
					const aura = d(assets.indicators.aura())
					const {x, z} = agent.coordinator.toPosition(place)
					const y = Math.max(
						agent.coordinator.tileHeight(agent.tiles.at(place)),
						agent.coordinator.tileHeight(agent.tiles.at(neighbor)),
					)
					aura.position.set(x, y, z)
					const twist = index + 1
					aura.scaling.set(0.99, 0.2, 0.99)
					aura.rotationQuaternion = Quaternion.RotationYawPitchRoll(
						twist * Degrees.toRadians(-90),
						0,
						0,
					)
				}
			}
		}
	}

	dispose() {
		this.#trash.dispose()
	}
}

