
import {babyloid, make_envmap, Meshoid, Prop} from "@benev/toolbox"
import {ArcRotateCamera, DirectionalLight, PBRMaterial, TransformNode, Vector3} from "@babylonjs/core"

import {World} from "../world/world.js"

export async function freeplayFlow() {

	const world = await World.load()
	const {scene} = world

	const glb = await world.loadGlb("/assets/nightchess.glb")

	const envmap = make_envmap(scene, "/assets/studiolights.env")
	scene.environmentIntensity = 0.1

	const {props, materials, meshes} = (() => {
		const insta = glb.instantiateModelsToScene(n => n)
		const props = new Map<string, Prop>()
		const meshes = new Map<string, Meshoid>()
		const materials = new Map<string, PBRMaterial>()

		for (const material of glb.materials)
			if (material instanceof PBRMaterial)
				materials.set(material.name, material)

		for (const root of insta.rootNodes) {
			root
				.getChildren(babyloid.is.meshoid, false)
				.forEach(mesh => {
					meshes.set(mesh.name, mesh)
					if (!mesh.name.includes("_primitive"))
						props.set(mesh.name, mesh)
				})
			root
				.getChildren((n): n is TransformNode => n instanceof TransformNode, false)
				.forEach(transform => props.set(transform.name, transform))
		}

		return {props, meshes, materials}
	})()

	console.log("props", [...props.values()].map(m => m.name))
	console.log("meshes", [...meshes.values()].map(m => m.name))

	// for (const mesh of meshes.values()) {
	// 	console.log(mesh.name)
	// 	mesh.isVisible = false
	// }

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

