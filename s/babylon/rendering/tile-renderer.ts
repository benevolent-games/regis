
import {Vec2} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core"

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

	function positionBlock(instance: TransformNode, place: Vec2, elevation: number): void {
		const y = elevation
		const [x,,z] = coordinator.toPosition(place)
		instance.position.set(x, y, z)
	}

	function spawnBlock(place: Vec2, layer: number) {
		const instance = d(chessGlb.block(layer, "normal"))
		positionBlock(instance, place, layer)
		return instance
	}

	function spawnStep(place: Vec2, layer: number) {
		const instance = d(chessGlb.step(layer, "normal"))
		positionBlock(instance, place, layer)
		return instance
	}

	return ({tile, place}: {tile: Tile, place: Vec2}) => {
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
}

