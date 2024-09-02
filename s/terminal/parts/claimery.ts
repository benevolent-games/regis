
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
			const {resource, tech, watchtower} = tile.claim
			const position = agent.coordinator.toPosition(place)
			const staked = !!agent.claims.getStakeholder(place)

			let offset = 0

			function emplace(instance: TransformNode) {
				d(instance)
				const tweak = ((offset++) + 1) * constants.indicators.verticalOffsets.claimLayering
				instance.position.set(...vec3.add(position, [0, tweak, 0]))
				const onBlackSideOfBoard = place[1] > 3
				const flip = scalar.radians.from.degrees(180)
				if (onBlackSideOfBoard)
					instance.rotationQuaternion = (
						Quaternion.RotationYawPitchRoll(flip, 0, 0)
					)
				return instance
			}

			if (resource) {
				const level = agent.claims.determineResourceClaimLevel(place, resource)
				emplace(indicators.claims.resource(level, staked))
			}

			if (watchtower)
				emplace(indicators.claims.watchtower(staked))

			if (tech?.knight)
				emplace(indicators.claims.knight(staked))

			if (tech?.rook)
				emplace(indicators.claims.rook(staked))

			if (tech?.bishop)
				emplace(indicators.claims.bishop(staked))

			if (tech?.queen)
				emplace(indicators.claims.queen(staked))
		}
	}

	dispose() {
		this.#renderbin.dispose()
	}
}

