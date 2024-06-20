
import {Level} from "./level.js"
import {Stage, Vec2, load_glb, scalar} from "@benev/toolbox"
import {ArcRotateCamera, DirectionalLight, HemisphericLight, TransformNode, Vector3} from "@babylonjs/core"

export type Editor = Awaited<ReturnType<typeof editing>>

const tsize = {
	width: 6,
	height: 4,
}

export async function editing(stage: Stage) {
	const {scene} = stage
	const level = new Level([12, 8])
	const camera = make_camera(stage)

	const assets = await load_glb(scene, "/assets/props.glb")

	const sun = new DirectionalLight("sun", new Vector3(.234, -1, .123), scene)
	sun.intensity = 2

	const hemi = new HemisphericLight("hemi", new Vector3(.213, -1, .345), scene)
	hemi.intensity = .2

	const assetTerrainBlock = assets.transformNodes.find(n => n.name.includes("terrain-block"))!
	const originals = new TransformNode("originals", scene)
	const terrainBlock = assetTerrainBlock.clone("terrain-block-ready", originals)!

	const worldspace = ([tileX, tileY]: Vec2): Vec2 => {
		const [extentX, extentY] = level.extent
		const midX = extentX / 2
		const midY = extentY / 2
		const {width} = tsize
		const halfwidth = width / 2
		const x = ((tileX - midX) * tsize.width) + halfwidth
		const y = ((tileY - midY) * tsize.width) + halfwidth
		return [x, y]
	}

	level.setTile([0, 0], {kind: "block", elevation: 1})
	level.setTile([1, 1], {kind: "block", elevation: 1})
	level.setTile([2, 2], {kind: "block", elevation: 1})

	const instances = new TransformNode("instances", scene)

	for (const [tile, [x, y]] of level.loop()) {
		switch (tile.kind) {
			case "block": {
				const [worldX, worldZ] = worldspace([x, y])
				const worldY = tile.elevation * tsize.height
				const n = terrainBlock.instantiateHierarchy(instances)!
				n.position = new Vector3(worldX, worldY, worldZ)
				console.log([worldX, worldY, worldZ])
				break
			}
			case "ramp": {
				break
			}
			case "corner": {
				break
			}
		}
	}

	for (const n of assets.transformNodes)
		console.log(n.name)

	stage.gameloop.start()

	return {
		level,
		camera,
		dispose() {
			stage.gameloop.stop()
			stage.engine.dispose()
			stage.scene.dispose()
		},
	}
}

/////////////////////////////

function make_camera(stage: Stage) {
	const alpha = scalar.radians.from.degrees(90)
	const beta = scalar.radians.from.degrees(10)
	const radius = 70
	const camera = new ArcRotateCamera(
		"camera",
		alpha,
		beta,
		radius,
		new Vector3(0, 0, tsize.width * 0.5),
		stage.scene,
	)
	stage.rendering.setCamera(camera)
	return camera
}

