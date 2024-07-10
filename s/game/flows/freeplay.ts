
import {ev} from "@benev/slate"
import {make_envmap, scalar} from "@benev/toolbox"
import {DirectionalLight, Vector3} from "@babylonjs/core"

import {World} from "../world/world.js"
import {Stuff} from "../../tools/stuff.js"
import {Orbitcam} from "../orbitcam/orbitcam.js"

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

	stuff.instanceProp("pawn")
	stuff.instanceProp("border8x8")

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

