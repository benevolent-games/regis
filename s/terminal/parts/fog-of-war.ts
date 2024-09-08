
import {Trashbin} from "@benev/slate"
import {Quaternion} from "@babylonjs/core"
import {scalar, Vec2, vec2} from "@benev/toolbox"

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
		const inVision = (place: Vec2) => vision.some(v => vec2.equal(v, place))

		for (const place of vision) {
			for (const [index, cardinal] of cardinals.entries()) {
				const neighbor = vec2.add(place, cardinal)
				if (agent.tiles.valid(neighbor) && !inVision(neighbor)) {
					const aura = d(assets.indicators.aura())
					const position = agent.coordinator.toPosition(place)
					aura.position.set(...position)
					const twist = index + 1
					aura.scaling.set(0.99, 0.2, 0.99)
					aura.rotationQuaternion = Quaternion.RotationYawPitchRoll(
						twist * scalar.radians.from.degrees(-90),
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

