
import {World} from "../world/world.js"
import {ArcRotateCamera, DirectionalLight, HemisphericLight, MeshBuilder, PBRMaterial, StandardMaterial, Vector3} from "@babylonjs/core"

export async function freeplayFlow() {
	const world = await World.load()
	const {scene} = world

	const orbitcam = (() => {
		const name = "name"
		const alpha = 0
		const beta = Math.PI * (1 / 3)
		const radius = 20
		const target = new Vector3(0, 0, 0)
		return new ArcRotateCamera(name, alpha, beta, radius, target, scene)
	})()

	world.rendering.setCamera(orbitcam)

	const box = MeshBuilder.CreateBox("box", {
		width: 2,
		height: 1,
		depth: 2,
	}, scene)

	const material = new StandardMaterial("mat", scene)
	material.diffuseColor.set(.8, .8, .8)
	box.material = material

	const sun = new DirectionalLight(
		"sun",
		new Vector3(.123, -1, .234).normalize(),
		scene,
	)

	const hemi = new HemisphericLight(
		"hemi",
		new Vector3(.25, -1, .15).normalize(),
		scene,
	)

	sun.intensity = 2
	hemi.intensity = 2

	world.gameloop.on(() => {
		orbitcam.alpha += 0.01
		return () => {}
	})

	world.gameloop.start()

	return {
		world,
		orbitcam,
		box,
		sun,
		hemi,
		dispose: () => world.dispose(),
	}
}

