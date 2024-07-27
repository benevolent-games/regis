
import {AbstractMesh, MeshBuilder, TransformNode} from "@babylonjs/core"
import {assert_babylon_quaternion, Meshoid, vec3, Vec3} from "@benev/toolbox"

import {World} from "./world.js"
import {Assets} from "./assets.js"
import {Agent} from "../../logic/agent.js"
import {constants} from "../../constants.js"
import {UnitKind} from "../../logic/state.js"
import {Trashbin} from "../../tools/trashbin.js"

export type RosterPlacement = {
	mesh: Meshoid
	unitKind: UnitKind
	teamId: number
	position: Vec3
}

export class Rosters {
	placements = new Map<AbstractMesh, RosterPlacement>()
	#trashbin = new Trashbin()

	constructor(public options: {
		agent: Agent
		world: World
		assets: Assets
	}) {}

	render() {
		this.#trashbin.dispose()
		this.placements.clear()

		this.#instanceRoster(0, "team1-roster")
		this.#instanceRoster(1, "team2-roster")
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

		const placers = unitKinds.map((unitKind, index) => {
			const {size} = constants.block
			const instance = d(assets.units.unit.get(unitKind)!(teamId))
			const block = d(MeshBuilder.CreateBox("block", {size}, world.scene))

			const x = (index - offset) * constants.block.size
			const position: Vec3 = [x, 0, 0]
			block.position.set(x, -(size / 2), 0)
			instance.position.set(...position)

			block.setParent(transform)
			instance.setParent(transform)

			block.isVisible = false

			return () => {
				instance.computeWorldMatrix(true)
				const position = vec3.from.xyz(instance.getAbsolutePosition())
				this.placements.set(block, {mesh: block, unitKind, teamId, position})
			}
		})

		transform.position = rosterGuide.position.clone()
		transform.rotationQuaternion = assert_babylon_quaternion(rosterGuide)

		for (const placer of placers)
			placer()
	}

	dispose = this.#trashbin.dispose
}

