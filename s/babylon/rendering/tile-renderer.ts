
import {TransformNode} from "@babylonjs/core"
import {babyloid, Prop, Vec2} from "@benev/toolbox"

import {ChessGlb} from "../chess-glb.js"
import {Trashbin} from "../../tools/trashbin.js"
import {Tile} from "../../machinery/board/data.js"
import {Coordinator} from "../../machinery/coordinator.js"

export type TileRenderer = ReturnType<typeof makeTileRenderer>

export function makeTileRenderer(
		{disposable: d}: Trashbin,
		chessGlb: ChessGlb,
		coordinator: Coordinator,
	) {

	const blockPlacements = new Map<Prop, Vec2>()

	function positionBlock(instance: TransformNode, place: Vec2, elevation: number) {
		const y = elevation
		const [x,,z] = coordinator.toPosition(place)
		instance.position.set(x, y, z)
	}

	function saveBlockPlacement(instance: Prop, place: Vec2) {
		for (const mesh of [instance, ...instance.getChildMeshes()])
			if (babyloid.is.meshoid(mesh))
				blockPlacements.set(mesh, place)
	}

	function spawnBlock(place: Vec2, layer: number) {
		const instance = d(chessGlb.block(layer, "normal"))
		positionBlock(instance, place, layer)
		saveBlockPlacement(instance, place)
		return instance
	}

	function spawnStep(place: Vec2, layer: number) {
		const instance = d(chessGlb.step(layer, "normal"))
		positionBlock(instance, place, layer)
		saveBlockPlacement(instance, place)
		return instance
	}

	function renderTile(tile: Tile, place: Vec2) {
		if (tile.step)
			spawnStep(place, tile.elevation)
		else
			spawnBlock(place, tile.elevation)

		// spawn blocks underneath
		if (tile.elevation > 1)
			spawnBlock(place, 1)

		if (tile.elevation > 2)
			spawnBlock(place, 2)
	}

	return {
		renderTile,
		blockPlacements,
	}
}

