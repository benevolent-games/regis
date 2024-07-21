
import {Vec2} from "@benev/toolbox"

import {Trashbin} from "../../tools/trashbin.js"
import {Board} from "../../logic/state/board.js"
import {AgentState} from "../../logic/state/game.js"
import {makeVisualizerBasics} from "./parts/basics.js"
import {makeTileRenderer} from "./parts/tile-renderer.js"
import {makeUnitRenderer} from "./parts/unit-renderer.js"
import {makeCameraRigging} from "./parts/camera-rigging.js"
import {makeHoverRenderer} from "./parts/hover-renderer.js"

export type Visualizer = Awaited<ReturnType<typeof makeVisualizer>>

export async function makeVisualizer() {
	const trashbin = new Trashbin()
	const d = trashbin.disposable

	const {world, chessGlb} = d(await makeVisualizerBasics())

	// initialize border
	d(chessGlb.border())

	// renderers
	const tileRenderer = d(makeTileRenderer(world, chessGlb))
	const unitRenderer = d(makeUnitRenderer(chessGlb))
	const hoverRenderer = d(makeHoverRenderer(chessGlb))
	const {orbitcam} = d(makeCameraRigging(world))

	// start the rendering gameloop
	world.gameloop.start()

	return {
		world,
		orbitcam,
		tileRenderer,
		unitRenderer,
		hoverRenderer,
		dispose: trashbin.dispose,

		// render a new state
		update(state: AgentState) {
			tileRenderer.render(state.board)
			unitRenderer.render(state.board, state.units)
		},
	}
}

