
import {Vec3} from "@benev/toolbox"
import {Trashbin} from "@benev/slate"
import {TransformNode} from "@babylonjs/core"

import {Assets} from "./assets.js"
import {Agent} from "../../logic/agent.js"

export class Claimery {
	#renderbin = new Trashbin()

	constructor(private options: {
		agent: Agent
		assets: Assets
	}) {}

	render() {
		const {agent, assets: {indicators}} = this.options
		const d = this.#renderbin.disposable

		function emplace(instance: TransformNode, position: Vec3) {
			d(instance)
			instance.position.set(...position)
			return instance
		}

		for (const {place, tile} of agent.tiles.list()) {
			const {resource, tech, watchtower} = tile.claim
			const position = agent.coordinator.toPosition(place)

			if (resource) {
				const level = agent.claims.determineResourceClaimLevel(place, resource)
				emplace(indicators.claims.resource(level), position)
			}

			if (watchtower)
				emplace(indicators.claims.watchtower(), position)

			if (tech?.knight)
				emplace(indicators.claims.knight(), position)

			if (tech?.rook)
				emplace(indicators.claims.rook(), position)

			if (tech?.bishop)
				emplace(indicators.claims.bishop(), position)

			if (tech?.queen)
				emplace(indicators.claims.queen(), position)
		}
	}

	dispose() {
		this.#renderbin.dispose()
	}
}

