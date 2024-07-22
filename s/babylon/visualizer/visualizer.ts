
import {Viz} from "./viz.js"
import {Party} from "./parts/party.js"
import {Agent} from "../../logic/agent.js"
import {Trashbin} from "../../tools/trashbin.js"
import {makeVisualizerBasics} from "./parts/basics.js"
import {makeTileRenderer} from "./parts/tile-renderer.js"
import {makeUnitRenderer} from "./parts/unit-renderer.js"
import {makeCameraRigging} from "./parts/camera-rigging.js"
import {makeHoverRenderer} from "./parts/hover-renderer.js"
import {makeSelectionRenderer} from "./parts/selection-renderer.js"

export type Visualizer = Awaited<ReturnType<typeof makeVisualizer>>

export async function makeVisualizer(agent: Agent) {
	const trashbin = new Trashbin()
	const d = trashbin.disposable

	const {world, chessGlb} = d(await makeVisualizerBasics())

	// party contains local ui state
	const party = new Party({
		agent,
		updateHover: () => hoverRenderer.render(),
		updateSelection: () => selectionRenderer.render(),
	})

	const viz: Viz = {agent, party, world, chessGlb}

	// initialize border
	d(chessGlb.border())

	// renderers
	const tileRenderer = d(makeTileRenderer(viz))
	const unitRenderer = d(makeUnitRenderer(viz))
	const hoverRenderer = d(makeHoverRenderer(viz))
	const selectionRenderer = d(makeSelectionRenderer(viz))
	const {orbitcam} = d(makeCameraRigging(world))

	// start the rendering gameloop
	world.gameloop.start()

	function update() {
		tileRenderer.render()
		unitRenderer.render()
		hoverRenderer.render()
		selectionRenderer.render()
	}

	return {
		world,
		party,
		orbitcam,
		dispose: trashbin.dispose,

		pickTile: tileRenderer.pick,

		// fully render a new state
		update,
	}
}

