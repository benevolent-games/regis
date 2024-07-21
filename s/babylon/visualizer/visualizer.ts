
import {Vec2} from "@benev/toolbox"

import {Trashbin} from "../../tools/trashbin.js"
import {Detective} from "../../logic/detective.js"
import {BoardState} from "../../logic/state/board.js"
import {AgentState} from "../../logic/state/game.js"
import {makeVisualizerBasics} from "./parts/basics.js"
import {makeTileRenderer} from "./parts/tile-renderer.js"
import {makeUnitRenderer} from "./parts/unit-renderer.js"
import {makeCameraRigging} from "./parts/camera-rigging.js"
import {makeHoverRenderer} from "./parts/hover-renderer.js"
import {makeSelectionRenderer} from "./parts/selection-renderer.js"

export type Visualizer = Awaited<ReturnType<typeof makeVisualizer>>

export async function makeVisualizer(detective: Detective) {
	const trashbin = new Trashbin()
	const d = trashbin.disposable

	const {world, chessGlb} = d(await makeVisualizerBasics())

	// initialize border
	d(chessGlb.border())

	// renderers
	const tileRenderer = d(makeTileRenderer(detective, world, chessGlb))
	const unitRenderer = d(makeUnitRenderer(detective, chessGlb))
	const hoverRenderer = d(makeHoverRenderer(detective, chessGlb))
	const selectionRenderer = d(makeSelectionRenderer(detective, chessGlb))
	const {orbitcam} = d(makeCameraRigging(world))

	// start the rendering gameloop
	world.gameloop.start()

	return {
		world,
		orbitcam,
		tileRenderer,
		unitRenderer,
		hoverRenderer,
		selectionRenderer,
		dispose: trashbin.dispose,

		// render a new state
		update() {
			tileRenderer.render()
			unitRenderer.render()
		},
	}
}

