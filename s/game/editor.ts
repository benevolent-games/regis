
// import {Level} from "./level.js"
// import {Stage, Vec2, Vec3, load_glb, scalar} from "@benev/toolbox"
// import {ArcRotateCamera, AssetContainer, Color3, DirectionalLight, HemisphericLight, Mesh, MeshBuilder, Scene, StandardMaterial, TransformNode, Vector3} from "@babylonjs/core"

import {EditorInputs} from "./editor-inputs.js"

export class EditorCore {
	inputs = new EditorInputs()
}

// export type Editor = Awaited<ReturnType<typeof editing>>

// const tsize = {
// 	width: 6,
// 	height: 4,
// }

// export type Payload = {
// 	stage: Stage
// 	props: AssetContainer
// }

// export class Editor2 {
// 	stage: Stage
// 	props: AssetContainer

// 	floor: Floor
// 	level: Level
// 	lighting: Lighting
// 	camrig: Camrig

// 	constructor({stage, props}: Payload) {
// 		this.stage = stage
// 		this.props = props

// 		const {scene} = stage
// 		this.floor = new Floor(scene)
// 		this.level = new Level([7, 5])
// 		this.lighting = new Lighting(scene)
// 		this.camrig = new Camrig({scene, angle: 10, distance: tsize.width * 7})

// 		stage.rendering.setCamera(this.camrig.camera)
// 	}

// 	dispose() {
// 		this.stage.rendering.setCamera(null)
// 	}
// }

// export async function editing(stage: Stage) {
// 	const {scene} = stage

// 	const props = await load_glb(scene, "/assets/props.glb")
// 	const assetTerrainBlock = props.transformNodes.find(n => n.name.includes("terrain-block"))!
// 	const originals = new TransformNode("originals", scene)
// 	const terrainBlock = assetTerrainBlock.clone("terrain-block-ready", originals)!

// 	const worldspace = ([tileX, tileY]: Vec2): Vec2 => {
// 		const [extentX, extentY] = level.extent
// 		const midX = extentX / 2
// 		const midY = extentY / 2
// 		const {width} = tsize
// 		const halfwidth = width / 2
// 		const x = ((tileX - midX) * tsize.width) + halfwidth
// 		const y = ((tileY - midY) * tsize.width) + halfwidth
// 		return [x, y]
// 	}

// 	level.setTile([0, 0], {kind: "block", elevation: 1})
// 	level.setTile([1, 1], {kind: "block", elevation: 1})
// 	level.setTile([2, 2], {kind: "block", elevation: 1})

// 	const instances = new TransformNode("instances", scene)

// 	for (const [tile, [x, y]] of level.loop()) {
// 		switch (tile.kind) {
// 			case "block": {
// 				const [worldX, worldZ] = worldspace([x, y])
// 				const worldY = tile.elevation * tsize.height
// 				const n = terrainBlock.instantiateHierarchy(instances)!
// 				n.position = new Vector3(worldX, worldY, worldZ)
// 				console.log([worldX, worldY, worldZ])
// 				break
// 			}
// 			case "ramp": {
// 				break
// 			}
// 			case "corner": {
// 				break
// 			}
// 		}
// 	}

// 	for (const n of props.transformNodes)
// 		console.log(n.name)

// 	stage.gameloop.start()

// 	return {
// 		level,
// 		camera: camrig,
// 		dispose() {
// 			stage.gameloop.stop()
// 			stage.engine.dispose()
// 			stage.scene.dispose()
// 		},
// 	}
// }

// /////////////////////////////
// /////////////////////////////
// /////////////////////////////

// class Camrig {
// 	camera: ArcRotateCamera

// 	constructor({
// 			scene,
// 			angle: beta,
// 			distance: radius,
// 		}: {
// 			scene: Scene
// 			angle: number
// 			distance: number
// 		}) {

// 		const alpha = scalar.radians.from.degrees(90)

// 		this.camera = new ArcRotateCamera(
// 			"camera",
// 			alpha,
// 			beta,
// 			radius,
// 			new Vector3(0, 0, 0),
// 			scene,
// 		)
// 	}

// 	get position(): Vec3 {
// 		return this.camera.position.asArray()
// 	}

// 	set position(vec: Vec3) {
// 		this.camera.position.set(...vec)
// 	}
// }

// class Floor {
// 	mesh: Mesh
// 	material: StandardMaterial

// 	constructor(scene: Scene) {
// 		const material = new StandardMaterial("water", scene)
// 		material.diffuseColor = new Color3(.2, .4, .8)
// 		material.specularColor = material.diffuseColor

// 		const mesh = MeshBuilder.CreateGround("water", {
// 			width: 1000,
// 			height: 1000,
// 			subdivisions: 4,
// 		})
// 		mesh.material = material
// 		mesh.position.y = -1

// 		this.mesh = mesh
// 		this.material = material
// 	}
// }

// class Lighting {
// 	sun: DirectionalLight
// 	hemi: HemisphericLight

// 	constructor(scene: Scene) {
// 		const sun = new DirectionalLight("sun", new Vector3(.234, -1, .123), scene)
// 		sun.intensity = 2

// 		const hemi = new HemisphericLight("hemi", new Vector3(.213, -1, .345), scene)
// 		hemi.intensity = .2

// 		this.sun = sun
// 		this.hemi = hemi
// 	}
// }

