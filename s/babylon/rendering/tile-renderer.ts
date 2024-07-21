
import {TransformNode} from "@babylonjs/core"
import {babyloid, Prop, Vec2} from "@benev/toolbox"

import {constants} from "./constants.js"
import {Venue} from "./aspects/venue.js"
import {Ephemeral} from "./aspects/ephemeral.js"
import {Board, Tile} from "../../logic/state/board.js"
import {Coordinator} from "../../logic/helpers/coordinator.js"

export type TileRenderer = ReturnType<typeof makeTileRenderer>

export function makeTileRenderer(
		board: Board,
		venue: Venue,
		ephemeral: Ephemeral,
	) {

	const {chessGlb} = venue
	const {trashbin} = ephemeral

	const coordinator = new Coordinator({
		board,
		blockSize: constants.blockSize,
		blockHeight: constants.blockHeight,
	})

	function positionBlock(instance: TransformNode, place: Vec2, elevation: number) {
		const y = elevation
		const [x,,z] = coordinator.toPosition(place)
		instance.position.set(x, y, z)
	}

	function saveBlockPlacement(instance: Prop, place: Vec2) {
		for (const mesh of [instance, ...instance.getChildMeshes()])
			if (babyloid.is.meshoid(mesh))
				ephemeral.blockPlacements.set(mesh, place)
	}

	function spawnBlock(place: Vec2, layer: number) {
		const instance = trashbin.disposable(chessGlb.block(layer, "normal"))
		positionBlock(instance, place, layer)
		saveBlockPlacement(instance, place)
		return instance
	}

	function spawnStep(place: Vec2, layer: number) {
		const instance = trashbin.disposable(chessGlb.step(layer, "normal"))
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

	return {renderTile}
}

