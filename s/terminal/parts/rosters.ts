
import {Trashbin} from "@benev/slate"
import {AbstractMesh, MeshBuilder, TransformNode} from "@babylonjs/core"
import {assert_babylon_quaternion, Meshoid, vec3, Vec3} from "@benev/toolbox"

import {World} from "./world.js"
import {Agent} from "../../logic/agent.js"
import {Assets} from "../assets/assets.js"
import {constants} from "../../constants.js"
import {UnitKind} from "../../config/units.js"
import {TurnTracker} from "../../logic/simulation/aspects/turn-tracker.js"
import { TeamId } from "../../logic/state.js"

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
		turnTracker: TurnTracker
	}) {}

	render() {
		this.#trashbin.dispose()
		this.placements.clear()
		return this.#instanceRoster(this.options.turnTracker.teamId)
	}

	#instanceRoster(teamId: number) {
		const {assets, world, agent} = this.options
		const d = this.#trashbin.disposable

		const rosterGuide = assets.board.roster(teamId)
		rosterGuide.computeWorldMatrix(true)

		const recruitableUnits = Object.entries(agent.state.initial.config.archetypes)
			.filter(([,archetype]) => !!archetype.recruitable)
			.map(([kind]) => kind as UnitKind)

		const tech = agent.claims.teamTech(teamId)

		const offset = (recruitableUnits.length / 2) - 0.5
		const transform = new TransformNode("rosterRoot", world.scene)

		const placers = recruitableUnits.map((unitKind, index) => {
			const isUnlocked = tech.has(unitKind)
			if (!isUnlocked)
				return () => {}

			const {size} = constants.block
			const instance = d(assets.units.unit(unitKind, teamId, null))
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
		rosterGuide.dispose()

		for (const placer of placers)
			placer()
	}

	dispose = this.#trashbin.dispose
}

