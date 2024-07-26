
import {AbstractMesh, MeshBuilder, TransformNode} from "@babylonjs/core"
import {assert_babylon_quaternion, Meshoid, Vec3} from "@benev/toolbox"

import {Pointing} from "./types.js"
import {World} from "./parts/world.js"
import {Assets} from "./parts/assets.js"
import {Agent} from "../../logic/agent.js"
import {constants} from "../../constants.js"
import {UnitKind} from "../../logic/state.js"
import {Trashbin} from "../../tools/trashbin.js"
import {wherefor} from "../../tools/wherefor.js"

export type RosterChunk = {
	mesh: Meshoid
	unitKind: UnitKind
	teamId: number
	position: Vec3
}

export type FnPickRosterChunk = (pointing: Pointing) => (RosterChunk | undefined)

export class Rosters {
	chunks = new Map<AbstractMesh, RosterChunk>()
	#trashbin = new Trashbin()

	constructor(public options: {
		agent: Agent
		world: World
		assets: Assets
	}) {}

	render() {
		this.#trashbin.dispose()
		this.chunks.clear()

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

		unitKinds.forEach((unitKind, index) => {
			const {size} = constants.block
			const instance = d(assets.units.unit.get(unitKind)!(teamId))
			const block = d(MeshBuilder.CreateBox("block", {size}, world.scene))

			const x = (index - offset) * constants.block.size
			const position: Vec3 = [x, 0, 0]
			block.position.set(x, -(size / 2), 0)
			instance.position.set(...position)

			block.setParent(transform)
			instance.setParent(transform)

			this.chunks.set(block, {mesh: block, unitKind, teamId, position})
		})

		transform.position = rosterGuide.position.clone()
		transform.rotationQuaternion = assert_babylon_quaternion(rosterGuide)
	}

	pick: FnPickRosterChunk = event => wherefor(
		this.options.world.scene.pick(
			event.clientX,
			event.clientY,
			mesh => this.chunks.has(mesh),
		).pickedMesh,
		mesh => this.chunks.get(mesh)!
	)

	dispose = this.#trashbin.dispose
}

