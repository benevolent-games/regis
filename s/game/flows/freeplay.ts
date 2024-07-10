
import {ev} from "@benev/slate"
import {make_envmap, scalar} from "@benev/toolbox"
import {DirectionalLight, Vector3} from "@babylonjs/core"

import {World} from "../world/world.js"
import {Stuff} from "../../tools/stuff.js"
import {Orbitcam} from "../orbitcam/orbitcam.js"
import { BoardRenderer, Gameboard } from "../board/gameboard.js"

const {degrees} = scalar.radians.from

export async function freeplayFlow() {

	const world = await World.load()
	const {scene} = world

	const glb = await world.loadGlb("/assets/nightchess.glb")
	const envmap = make_envmap(scene, "/assets/studiolights.env")
	scene.environmentIntensity = 0.1

	const stuff = new Stuff(glb)

	console.log("props", [...stuff.props.values()].map(m => m.name))
	console.log("meshes", [...stuff.meshes.values()].map(m => m.name))

	const pawn = stuff.instanceProp("pawn")
	stuff.instanceProp("border8x8")

	const gameboard = new Gameboard()
	gameboard.at([2, 2]).elevation = 1
	gameboard.at([2, 3]).elevation = 1
	gameboard.at([3, 2]).elevation = 1
	gameboard.at([3, 3]).elevation = 2

	const boardRenderer = new BoardRenderer({
		stuff,
		gameboard,
		blockSize: 2,
		blockHeight: 1,
		blockNames: [
			"grid-floor-bottom",
			"grid-floor-middle",
			"grid-floor-top",
		],
	})
	boardRenderer.render()
	pawn.position.set(...boardRenderer.location([3, 3]))

	const orbitcam = new Orbitcam({
		scene,
		sensitivity: 1 / 100,
		smoothing: 5,
		verticalRange: [degrees(0), degrees(70)],
		verticalRadii: [30, 5],
	})
	world.rendering.setCamera(orbitcam.camera)
	const unbindOrbitControls = ev(world.canvas, orbitcam.events)
	const stopOrbitTick = world.gameloop.on(orbitcam.tick)

	const sun = new DirectionalLight(
		"sun",
		new Vector3(.123, -1, .234).normalize(),
		scene,
	)

	sun.intensity = .2
	world.gameloop.start()

	return {
		world,
		orbitcam,
		sun,
		dispose: () => {
			envmap.dispose()
			world.dispose()
			stopOrbitTick()
			unbindOrbitControls()
			orbitcam.dispose()
		},
	}
}

