
import {MeshBuilder, TransformNode} from "@babylonjs/core"
import {assert_babylon_quaternion, Meshoid} from "@benev/toolbox"

import {World} from "./parts/world.js"
import {Assets} from "./parts/assets.js"
import {Agent} from "../../logic/agent.js"
import {constants} from "../../constants.js"
import {UnitKind} from "../../logic/state.js"
import {Trashbin} from "../../tools/trashbin.js"

export class Rosters {
	#trashbin = new Trashbin()

	blocks: {
		block: Meshoid
		unitKind: UnitKind
		teamId: number
	}[] = []

	constructor(public options: {
		agent: Agent
		world: World
		assets: Assets
	}) {}

	render() {
		this.#trashbin.dispose()
		this.blocks = []

		this.#instanceRoster(0, "team1-roster")
		this.#instanceRoster(1, "team1-roster.001")
	}

	#instanceRoster(teamId: number, propName: string) {
		const {assets, world} = this.options
		const d = this.#trashbin.disposable

		const rosterGuide = assets.board.instance(propName)
		rosterGuide.computeWorldMatrix(true)
		rosterGuide.dispose()

		const unitKinds: UnitKind[] = [
			"pawn", "knight", "rook", "bishop", "queen", "king",
		]

		const offset = (unitKinds.length / 2) - 0.5
		const transform = new TransformNode("rosterRoot", world.scene)

		unitKinds.forEach((unitKind, index) => {
			const {size} = constants.block
			const instance = d(assets.units.unit.get(unitKind)!(teamId))
			const block = d(MeshBuilder.CreateBox("block", {size}, world.scene))

			const x = (index - offset) * constants.block.size
			block.position.set(x, -(size / 2), 0)
			instance.position.set(x, 0, 0)

			block.setParent(transform)
			instance.setParent(transform)

			this.blocks.push({block, unitKind, teamId})
		})

		transform.position = rosterGuide.position.clone()
		transform.rotationQuaternion = assert_babylon_quaternion(rosterGuide)
	}

	dispose = this.#trashbin.dispose
}

