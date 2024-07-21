
import {ev} from "@benev/slate"
import {make_envmap, scalar} from "@benev/toolbox"

import {World} from "../world.js"
import {Orbitcam} from "../orbitcam.js"
import {ChessGlb} from "../chess-glb.js"
import {constants} from "../constants.js"
import {AgentState} from "../../logic/state/game.js"
import {makeTileRenderer} from "./parts/tile-renderer.js"

const {degrees} = scalar.radians.from

export type Visualizer = Awaited<ReturnType<typeof makeVisualizer>>

export async function makeVisualizer() {
	const {world, chessGlb} = await makeVisualizerBasics()
	const {orbitcam} = makeVisualizerFixtures(world)
	const tiles = makeTileRenderer(chessGlb)

	function grab(event: PointerEvent) {
		const {pickedMesh} = world.scene.pick(
			event.clientX,
			event.clientY,
			mesh => tiles.blockPlacements.has(mesh),
		)
		if (pickedMesh)
			return tiles.blockPlacements.get(pickedMesh)!
	}

	world.gameloop.start()

	return {
		grab,
		world,
		tiles,
		orbitcam,
		update(state: AgentState) {
			tiles.render(state.board)
		},
		dispose() {
			world.gameloop.stop()
			tiles.dispose()
			orbitcam.dispose()
			chessGlb.container.dispose()
			world.dispose()
		},
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////

export async function makeVisualizerBasics() {
	const world = await World.load()
	const container = await world.loadContainer(constants.urls.chessGlb)
	const {scene} = world

	const chessGlb = new ChessGlb(container)
	chessGlb.props.forEach((_, name) => console.log("prop:", name))

	make_envmap(scene, constants.urls.envmap)
	scene.environmentIntensity = 0.1

	return {world, chessGlb}
}

////////////////////////////////////////////////
////////////////////////////////////////////////

export function makeVisualizerFixtures(
		{scene, canvas, rendering, gameloop}: World,
	) {

	const orbitcam = new Orbitcam({
		scene,
		smoothing: 7,
		zoomRange: [3, 50],
		straightenAtTop: false,
		zoomAddsPivotHeight: 1.5,
		zoomSensitivity: 3 / 100,
		orbitSensitivity: 5 / 1000,
		verticalRange: [degrees(0), degrees(90)],
	})

	orbitcam.gimbal = [degrees(90), degrees(45)]
	rendering.setCamera(orbitcam.camera)

	ev(canvas, {wheel: orbitcam.wheel})
	gameloop.on(orbitcam.tick)

	return {orbitcam}
}


