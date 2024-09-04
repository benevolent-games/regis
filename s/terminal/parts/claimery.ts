
import {Trashbin} from "@benev/slate"
import {scalar, vec3} from "@benev/toolbox"
import {Quaternion, TransformNode} from "@babylonjs/core"

import {Assets} from "./assets.js"
import {Agent} from "../../logic/agent.js"
import {constants} from "../../constants.js"

export class Claimery {
	#renderbin = new Trashbin()

	constructor(private options: {
		agent: Agent
		assets: Assets
	}) {}

	render() {
		this.dispose()
		const {agent, assets: {indicators}} = this.options
		const d = this.#renderbin.disposable

		for (const {place, tile} of agent.tiles.list()) {
			const {resource, specialResource, tech, watchtower} = tile.claim
			const hasClaim = !!(resource || specialResource || tech || watchtower)
			const position = agent.coordinator.toPosition(place)
			const staked = !!agent.claims.getStakeholder(place)

			let offset = 0

			function emplace(instance: TransformNode, scale = 1) {
				d(instance)
				const tweak = ((offset++) + 1) * constants.indicators.verticalOffsets.claimLayering
				instance.position.set(...vec3.add(position, [0, tweak, 0]))
				const onBlackSideOfBoard = place[1] > 3
				const flip = scalar.radians.from.degrees(180)
				if (onBlackSideOfBoard)
					instance.rotationQuaternion = (
						Quaternion.RotationYawPitchRoll(flip, 0, 0)
					)
				instance.scaling.set(
					...vec3.multiplyBy(instance.scaling.asArray(), scale)
				)
				return instance
			}

			//
			// claim corner squares
			//

			const unit = agent.units.at(place)
			const dry = resource && resource.stockpile <= 0
			const solid = resource
				? !dry
				: true

			const showCorners = hasClaim && !!(unit || dry)

			if (showCorners) {
				emplace(indicators.claims.corners(solid))
			}

			//
			// stickers
			//

			const scale = 0.6

			if (resource) {
				const level = resource.level
				emplace(indicators.claims.resource(level), scale)
			}

			if (specialResource) {
				emplace(indicators.claims.resource(3), scale)
			}

			if (watchtower)
				emplace(indicators.claims.watchtower(), scale)

			if (tech?.knight)
				emplace(indicators.claims.knight(), scale)

			if (tech?.rook)
				emplace(indicators.claims.rook(), scale)

			if (tech?.bishop)
				emplace(indicators.claims.bishop(), scale)

			if (tech?.queen)
				emplace(indicators.claims.queen(), scale)
		}
	}

	dispose() {
		this.#renderbin.dispose()
	}
}

