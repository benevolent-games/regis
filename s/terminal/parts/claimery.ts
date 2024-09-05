
import {Trashbin} from "@benev/slate"
import {scalar, Vec2, Vec3, vec3} from "@benev/toolbox"
import {Quaternion, TransformNode} from "@babylonjs/core"

import {World} from "./world.js"
import {Agent} from "../../logic/agent.js"
import {Assets} from "../assets/assets.js"
import {constants} from "../../constants.js"
import {Claim, Tile} from "../../logic/state.js"

type StickerLayout = {
	scale: number

	/**
	 * coordinate origin [0, 0] is the bottom-left of a tile,
	 * [1, 1] is the top-right.
	 */
	coordinates: Vec2
}

const singleLayout: StickerLayout[] = [
	{scale: 1, coordinates: [0.5, 0.5]},
]

const quadLayout: StickerLayout[] = [
	{scale: 0.5, coordinates: [0.25, 0.75]},
	{scale: 0.5, coordinates: [0.75, 0.75]},
	{scale: 0.5, coordinates: [0.25, 0.25]},
	{scale: 0.5, coordinates: [0.75, 0.25]},
]

export class Claimery {
	#bin = new Trashbin()

	constructor(private options: {
		agent: Agent
		world: World
		assets: Assets
	}) {}

	#instanceSticker(claim: Claim.Any) {
		const {agent, assets: {indicators}} = this.options
		switch (claim.kind) {
			case "resource": return indicators.claims.resource(claim.level)
			case "specialResource": return indicators.claims.specialResource()
			case "watchtower": return indicators.claims.watchtower()
			case "tech": return indicators.claims.tech(claim.unlock)
			default: throw new Error(`unknown claim kind`)
		}
	}

	#renderClaimStickersInLayout(place: Vec2, claim: Claim.Any[], layout: StickerLayout[]) {
		const d = this.#bin.disposable
		const {agent, world} = this.options

		const root = d(new TransformNode("claimroot", world.scene))

		claim.forEach((claim, index) => {
			const arrangement = layout.at(index)
			if (!arrangement)
				return

			const {scale, coordinates: [x, y]} = arrangement
			const sticker = d(this.#instanceSticker(claim))
			const s = constants.block.size
			sticker.position.set(-x * s, 0, y * s)
			sticker.scaling.setAll(scale)
			sticker.setParent(root)
		})

		const offset = 0.01
		const position = agent.coordinator.toPosition(place)
		root.position.set(...vec3.add(position, [0, offset, 0]))
	}

	render() {
		this.dispose()
		const {agent} = this.options

		for (const {place, tile: {claims}} of agent.tiles.list()) {
			if (claims.length === 0)
				continue

			else if (claims.length === 1)
				this.#renderClaimStickersInLayout(place, claims, singleLayout)

			else
				this.#renderClaimStickersInLayout(place, claims, quadLayout)
		}

		// for (const {place, tile} of agent.tiles.list()) {
		// 	const {resource, specialResource, tech, watchtower} = tile.claim
		// 	const hasClaim = !!(resource || specialResource || tech || watchtower)
		// 	const position = agent.coordinator.toPosition(place)
		// 	const staked = !!agent.claims.getStakeholder(place)
		//
		// 	let offset = 0
		//
		// 	function emplace(instance: TransformNode, scale = 1) {
		// 		d(instance)
		// 		const tweak = ((offset++) + 1) * constants.indicators.verticalOffsets.claimLayering
		// 		instance.position.set(...vec3.add(position, [0, tweak, 0]))
		// 		const onBlackSideOfBoard = place[1] > 3
		// 		const flip = scalar.radians.from.degrees(180)
		// 		if (onBlackSideOfBoard)
		// 			instance.rotationQuaternion = (
		// 				Quaternion.RotationYawPitchRoll(flip, 0, 0)
		// 			)
		// 		instance.scaling.set(
		// 			...vec3.multiplyBy(instance.scaling.asArray(), scale)
		// 		)
		// 		return instance
		// 	}
		//
		// 	//
		// 	// claim corner squares
		// 	//
		//
		// 	const unit = agent.units.at(place)
		// 	const dry = resource && resource.stockpile <= 0
		// 	const solid = resource
		// 		? staked && !dry
		// 		: staked
		//
		// 	const showCorners = hasClaim && !!(unit || dry)
		//
		// 	if (showCorners) {
		// 		emplace(indicators.claims.corners(solid))
		// 	}
		//
		// 	//
		// 	// stickers
		// 	//
		//
		// 	const scale = 1
		//
		// 	if (resource) {
		// 		const level = resource.level
		// 		emplace(indicators.claims.resource(level), scale)
		// 	}
		//
		// 	if (specialResource) {
		// 		emplace(indicators.claims.resource(3), scale)
		// 	}
		//
		// 	if (watchtower)
		// 		emplace(indicators.claims.watchtower(), scale)
		//
		// 	if (tech?.knight)
		// 		emplace(indicators.claims.knight(), scale)
		//
		// 	if (tech?.rook)
		// 		emplace(indicators.claims.rook(), scale)
		//
		// 	if (tech?.bishop)
		// 		emplace(indicators.claims.bishop(), scale)
		//
		// 	if (tech?.queen)
		// 		emplace(indicators.claims.queen(), scale)
		//
		// 	if (tech?.elephant)
		// 		emplace(indicators.claims.elephant(), scale)
		// }
	}

	dispose() {
		this.#bin.dispose()
	}
}

