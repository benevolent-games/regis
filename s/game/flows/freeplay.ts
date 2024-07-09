
import {make_envmap} from "@benev/toolbox"
import {ArcRotateCamera, DirectionalLight, Vector3} from "@babylonjs/core"

import {World} from "../world/world.js"
import {Stuff} from "../../tools/stuff.js"

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

	const orbitcam = (() => {
		const name = "name"
		const alpha = 0
		const beta = Math.PI * (1 / 3)
		const radius = 20
		const target = new Vector3(0, 0, 0)
		return new ArcRotateCamera(name, alpha, beta, radius, target, scene)
	})()

	world.rendering.setCamera(orbitcam)

	const sun = new DirectionalLight(
		"sun",
		new Vector3(.123, -1, .234).normalize(),
		scene,
	)

	sun.intensity = .2

	world.gameloop.on(() => {
		orbitcam.alpha += 0.01
		return () => {}
	})

	world.gameloop.start()

	return {
		world,
		orbitcam,
		sun,
		dispose: () => {
			envmap.dispose()
			world.dispose()
		},
	}
}

