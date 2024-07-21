
import {TransformNode} from "@babylonjs/core"
import {babyloid, Prop, Vec2} from "@benev/toolbox"

import {World} from "../../world.js"
import {ChessGlb} from "../../chess-glb.js"
import {Trashbin} from "../../../tools/trashbin.js"
import {Detective} from "../../../logic/detective.js"
import {BoardState, Tile} from "../../../logic/state/board.js"

export type TileRenderer = ReturnType<typeof makeTileRenderer>

export function makeTileRenderer(detective: Detective, world: World, chessGlb: ChessGlb) {
	const trashbin = new Trashbin()
	const blockPlacements = new Map<Prop, Vec2>()

	function wipe() {
		trashbin.dispose()
		blockPlacements.clear()
	}

	function render(board: BoardState) {
		wipe()

		function positionBlock(instance: TransformNode, place: Vec2, elevation: number) {
			const y = detective.coordinator.toHeight(elevation)
			const [x,,z] = detective.coordinator.toBlockPosition(place)
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

		for (const {tile, place} of detective.board.list())
			renderTile(tile, place)
	}

	function pick(event: {clientX: number, clientY: number}) {
		const {pickedMesh} = world.scene.pick(
			event.clientX,
			event.clientY,
			mesh => blockPlacements.has(mesh),
		)
		if (pickedMesh)
			return blockPlacements.get(pickedMesh)!
	}

	return {
		pick,
		render,
		blockPlacements,
		dispose: wipe,
	}
}

