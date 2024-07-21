
import {TransformNode} from "@babylonjs/core"
import {babyloid, Prop, Vec2} from "@benev/toolbox"

import {ChessGlb} from "../../chess-glb.js"
import {Trashbin} from "../../../tools/trashbin.js"
import {Board, Tile} from "../../../logic/state/board.js"
import {boardery} from "../../../logic/helpers/boardery.js"
import {coordinator} from "../../../logic/helpers/coordinator.js"

export function makeTileRenderer(chessGlb: ChessGlb) {
	const trashbin = new Trashbin()
	const blockPlacements = new Map<Prop, Vec2>()

	function wipe() {
		trashbin.dispose()
		blockPlacements.clear()
	}

	function render(board: Board) {
		wipe()

		function positionBlock(instance: TransformNode, place: Vec2, elevation: number) {
			const y = coordinator(board).toHeight(elevation)
			const [x,,z] = coordinator(board).toPosition(place)
			instance.position.set(x, y, z)
		}

		function saveBlockPlacement(instance: Prop, place: Vec2) {
			for (const mesh of [instance, ...instance.getChildMeshes()])
				if (babyloid.is.meshoid(mesh))
					blockPlacements.set(mesh, place)
		}

		function spawnBlock(place: Vec2, layer: number) {
			const instance = trashbin.disposable(chessGlb.block(layer, "normal"))
			positionBlock(instance, place, layer)
			saveBlockPlacement(instance, place)
			return instance
		}

		function spawnStep(place: Vec2, layer: number) {
			const instance = trashbin.disposable(chessGlb.step(layer - 1, "normal"))
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

		for (const {tile, place} of boardery(board).list())
			renderTile(tile, place)
	}

	return {
		render,
		blockPlacements,
		dispose: wipe,
	}
}

