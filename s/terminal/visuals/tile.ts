
import {TransformNode} from "@babylonjs/core"
import {babyloid, Prop, Vec2} from "@benev/toolbox"

import {World} from "./parts/world.js"
import {Assets} from "./parts/assets.js"
import {FnPickTilePlace} from "./types.js"
import {Tile} from "../../logic/state.js"
import {Trashbin} from "../../tools/trashbin.js"
import {wherefor} from "../../tools/wherefor.js"
import {Agent} from "../../logic/helpers/agent.js"

export function makeTileVisuals(agent: Agent, world: World, assets: Assets) {
	const trashbin = new Trashbin()
	const blockPlacements = new Map<Prop, Vec2>()

	function dispose() {
		trashbin.dispose()
		blockPlacements.clear()
	}

	function render() {
		dispose()

		function oddOrEven([x, y]: Vec2) {
			return ((x + y) % 2) === 0
				? "odd"
				: "even"
			// return ((agent.board.index(place) + place[1]) % 2) === 0
			// 	? "odd"
			// 	: "even"
		}

		function positionBlock(instance: TransformNode, place: Vec2, elevation: number) {
			const y = agent.coordinator.toHeight(elevation)
			const [x,,z] = agent.coordinator.toBlockPosition(place)
			instance.position.set(x, y, z)
		}

		function saveBlockPlacement(instance: Prop, place: Vec2) {
			for (const mesh of [instance, ...instance.getChildMeshes()])
				if (babyloid.is.meshoid(mesh))
					blockPlacements.set(mesh, place)
		}

		function spawnBlock(place: Vec2, layer: number) {
			const instance = trashbin.disposable(assets.theme.block(layer, oddOrEven(place)))
			positionBlock(instance, place, layer)
			saveBlockPlacement(instance, place)
			return instance
		}

		function spawnStep(place: Vec2, layer: number) {
			const instance = trashbin.disposable(assets.theme.step(layer - 1, oddOrEven(place)))
			positionBlock(instance, place, layer)
			saveBlockPlacement(instance, place)
			return instance
		}

		function renderTile(tile: Tile, place: Vec2) {
			if (tile.step) {
				spawnBlock(place, tile.elevation)
				spawnStep(place, tile.elevation + 1)
			}
			else {
				spawnBlock(place, tile.elevation)
			}

			// spawn blocks underneath
			if (tile.elevation > 1)
				spawnBlock(place, 1)

			if (tile.elevation > 2)
				spawnBlock(place, 2)
		}

		for (const {tile, place} of agent.tiles.list())
			renderTile(tile, place)
	}

	const pick: FnPickTilePlace = event => wherefor(
		world.scene.pick(
			event.clientX,
			event.clientY,
			mesh => blockPlacements.has(mesh),
		).pickedMesh,
		mesh => blockPlacements.get(mesh)!
	)

	return {pick, render, dispose}
}

