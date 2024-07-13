
import {vec2} from "@benev/toolbox"
import {ev, Pipe} from "@benev/slate"
import {DirectionalLight, Vector3} from "@babylonjs/core"
import {make_envmap, scalar, Vec3, vec3, Vec2} from "@benev/toolbox"

import {World} from "../world.js"
import {ChessGlb} from "../chess-glb.js"
import {Trashbin} from "../../tools/trashbin.js"
import {Arbiter} from "../../logic/arbiter/arbiter.js"
import * as asciiMaps from "../../logic/ascii/ascii-maps.js"

// import {Game} from "./parts/game.js"
// import {Place} from "../concepts.js"
// import {World} from "../world/world.js"
// import * as maps from "../ascii/maps.js"
// import {Stuff} from "../../tools/stuff.js"
// import {Trashbin} from "../../tools/trashbin.js"
// import {Orbitcam} from "../orbitcam/orbitcam.js"
// import {DragQueen} from "../../tools/drag-queen.js"

const {degrees} = scalar.radians.from

export async function freeplayFlow() {
	const trash = new Trashbin()
	const d = trash.disposable

	const arbiter = new Arbiter(asciiMaps.bridge)

	const world = d(await World.load())
	const container = d(await world.loadContainer("/assets/chess-07.glb"))
	const chessGlb = new ChessGlb(container)
	const {scene} = world

	return {world, dispose: trash.dispose}

	// const glb = d(await world.loadGlb("/assets/chess-05.glb"))
	// d(make_envmap(scene, "/assets/studiolights.env"))
	// scene.environmentIntensity = 0.1
	//
	// const stuff = new Stuff(glb)
	//
	// console.log("props", [...stuff.props.values()].map(m => m.name))
	// console.log("meshes", [...stuff.meshes.values()].map(m => m.name))
	//
	// const game = d(new Game(world, stuff, maps.bridge))
	//
	// const orbitcam = d(new Orbitcam({
	// 	scene,
	// 	smoothing: 7,
	// 	zoomRange: [3, 30],
	// 	straightenAtTop: false,
	// 	zoomAddsPivotHeight: 1.5,
	// 	zoomSensitivity: 3 / 100,
	// 	orbitSensitivity: 5 / 1000,
	// 	verticalRange: [degrees(0), degrees(90)],
	// }))
	//
	// orbitcam.gimbal = [degrees(-90), degrees(45)]
	// world.rendering.setCamera(orbitcam.camera)
	//
	// trash.add(ev(world.canvas, {wheel: orbitcam.wheel}))
	// trash.add(world.gameloop.on(orbitcam.tick))
	//
	// trash.add(game.cameraSelectacon.onSelected(selected => {
	// 	orbitcam.pivot = game.board.localize(
	// 		selected
	// 			? selected.place
	// 			: Place.coords(0, 0),
	// 	)
	// }))
	//
	// game.cameraSelectacon.select(new Place([3, 3]))
	//
	// const rightMouseDrags = new DragQueen({
	// 	predicate: event => event.button === 2,
	// 	onAnyDrag: () => {},
	// 	onAnyClick: () => {},
	// 	onIndentedDrag: orbitcam.drag,
	// 	onIndentedClick: event => {
	// 		const place = game.board.grab(event)
	// 		if (place)
	// 			game.cameraSelectacon.select(place)
	// 	},
	// })
	//
	// const middleMouseDrags = new DragQueen({
	// 	predicate: event => event.button === 1,
	// 	onAnyClick: () => {},
	// 	onIndentedDrag: () => {},
	// 	onIndentedClick: () => {},
	// 	onAnyDrag: ({movementX, movementY}) => {
	// 		const panningSensitivity = 2 / 100
	// 		const movement = [movementX, movementY] as Vec2
	// 		orbitcam.pivot = (
	// 			Pipe.with(movement)
	// 				.to(v => vec2.rotate(
	// 					v,
	// 					orbitcam.camera.alpha + scalar.radians.from.degrees(90)
	// 				))
	// 				.to(v => vec2.multiplyBy(v, panningSensitivity))
	// 				.to(([x, z]) => [x, 0, z] as Vec3)
	// 				.to(v => vec3.add(orbitcam.pivot, v))
	// 				.to(v => game.board.clampPosition(v))
	// 				.done()
	// 		)
	// 		const place = game.board.delocalize([orbitcam.pivot[0], orbitcam.pivot[2]])
	// 		console.log(place)
	// 	},
	// })
	//
	// trash.add(ev(world.canvas, rightMouseDrags.events))
	// trash.add(ev(world.canvas, middleMouseDrags.events))
	// trash.add(ev(document, {contextmenu: (e: Event) => e.preventDefault()}))
	//
	// const sun = d(new DirectionalLight(
	// 	"sun",
	// 	new Vector3(.123, -1, .234).normalize(),
	// 	scene,
	// ))
	//
	// sun.intensity = .2
	// world.gameloop.start()
	//
	// return {
	// 	sun,
	// 	world,
	// 	orbitcam,
	// 	dispose: trash.dispose,
	// }
}

