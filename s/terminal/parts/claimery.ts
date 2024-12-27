
import {Pipe, Trashbin} from "@benev/slate"
import {Quaternion, TransformNode} from "@babylonjs/core"
import {Degrees, Vec2, Vec3} from "@benev/toolbox"

import {World} from "./world.js"
import {Agent} from "../../logic/agent.js"
import {Assets} from "../assets/assets.js"
import {Claim} from "../../logic/state.js"
import {constants} from "../../constants.js"

type StickerLayout = {
	scale: number

	/**
	 * coordinate origin [0, 0] is the bottom-left of a tile,
	 * [1, 1] is the top-right.
	 */
	coordinates: Vec2
}

const singleLayout: StickerLayout[] = [
	{scale: 1, coordinates: new Vec2(0.5, 0.5)},
]

const quadLayout: StickerLayout[] = [
	{scale: 0.6, coordinates: new Vec2(0.33, 0.66)}, // top-left
	{scale: 0.6, coordinates: new Vec2(0.66, 0.33)}, // bottom-right
	{scale: 0.6, coordinates: new Vec2(0.33, 0.33)}, // bottom-left
	{scale: 0.6, coordinates: new Vec2(0.66, 0.66)}, // top-right
]

export class Claimery {
	#bin = new Trashbin()

	constructor(private options: {
		agent: Agent
		world: World
		assets: Assets
	}) {}

	#instanceSticker(claim: Claim.Any) {
		const {assets: {indicators}} = this.options
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

			const {scale, coordinates} = arrangement
			const sticker = d(this.#instanceSticker(claim))
			const {x, y} = coordinates
				.clone()
				.add_(-0.5, -0.5)
				.multiplyBy(constants.block.size)

			sticker.scaling.setAll(scale)
			sticker.position.set(x, 0, -y)
			sticker.setParent(root)
		})

		const offset = 0.01
		const position = agent.coordinator.toPosition(place)
		root.position.set(
			...position
				.clone()
				.add_(0, offset, 0)
				.array()
		)

		const [,extentY] = agent.state.initial.board.extent
		const onBlackSideOfBoard = place.y > (extentY / 2)
		const flip = Degrees.toRadians(180)
		root.rotationQuaternion = onBlackSideOfBoard
			? Quaternion.RotationYawPitchRoll(flip, 0, 0)
			: Quaternion.RotationYawPitchRoll(0, 0, 0)
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
	}

	dispose() {
		this.#bin.dispose()
	}
}

