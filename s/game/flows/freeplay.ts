
import {vec2} from "@benev/toolbox"
import {ev, Pipe} from "@benev/slate"
import {DirectionalLight, Vector3} from "@babylonjs/core"
import {make_envmap, scalar, Vec3, vec3, Vec2} from "@benev/toolbox"

import {World} from "../world/world.js"
import {BlockInstancers, Board} from "../board/board.js"
import * as maps from "../ascii/maps.js"
import {Stuff} from "../../tools/stuff.js"
import {Orbitcam} from "../orbitcam/orbitcam.js"
import {DragQueen} from "../../tools/drag-queen.js"
import {parseAsciiMap} from "../ascii/parse-ascii-map.js"
import {Bishop, Grid, King, Knight, Pawn, Place, Placements, Queen, Rook, Selectacon} from "../concepts.js"

const {degrees} = scalar.radians.from

export async function freeplayFlow() {
	const world = await World.load()
	const {scene} = world

	const glb = await world.loadGlb("/assets/chess-05.glb")
	const envmap = make_envmap(scene, "/assets/studiolights.env")
	scene.environmentIntensity = 0.1

	const stuff = new Stuff(glb)

	console.log("props", [...stuff.props.values()].map(m => m.name))
	console.log("meshes", [...stuff.meshes.values()].map(m => m.name))

	stuff.instanceProp("border8x8")
	const grid = new Grid()
	const placements = new Placements()
	const properSelectacon = new Selectacon(grid, placements)
	const cameraSelectacon = new Selectacon(grid, placements)
	const blockInstancers = (name: string): BlockInstancers => ({
		normal: () => stuff.instanceProp(`${name}`),
		vision: () => stuff.instanceProp(`${name}-vision`),
		hover: () => stuff.instanceProp(`${name}-hover`),
		selected: () => stuff.instanceProp(`${name}-selected`),
	})
	const board = new Board({
		grid,
		properSelectacon: properSelectacon,
		placements,
		blocks: {
			size: 2,
			height: 1,
			instancers: {
				box: {
					levelOne: blockInstancers("block1"),
					levelTwo: blockInstancers("block2"),
					levelThree: blockInstancers("block3"),
				},
				ramp: {
					levelTwo: blockInstancers("ramp2"),
					levelThree: blockInstancers("ramp3"),
				},
			},
		},
		unitInstancers: (new Map()
			.set(King, () => stuff.instanceProp("unit-king"))
			.set(Queen, () => stuff.instanceProp("unit-queen"))
			.set(Bishop, () => stuff.instanceProp("unit-bishop"))
			.set(Knight, () => stuff.instanceProp("unit-knight"))
			.set(Rook, () => stuff.instanceProp("unit-rook"))
			.set(Pawn, () => stuff.instanceProp("unit-pawn"))
		),
	})

	parseAsciiMap({
		grid,
		placements,
		ascii: maps.terrorBridge,
	})

	board.render()

	const orbitcam = new Orbitcam({
		scene,
		smoothing: 7,
		zoomRange: [3, 30],
		straightenAtTop: false,
		zoomAddsPivotHeight: 1.5,
		zoomSensitivity: 3 / 100,
		orbitSensitivity: 5 / 1000,
		verticalRange: [degrees(0), degrees(90)],
	})
	orbitcam.gimbal = [degrees(-90), degrees(45)]
	world.rendering.setCamera(orbitcam.camera)
	const disposeOrbit = (() => {
		const unbindCanvas = ev(world.canvas, {wheel: orbitcam.wheel})
		const stopTicking = world.gameloop.on(orbitcam.tick)
		return () => {
			unbindCanvas()
			stopTicking()
			orbitcam.dispose()
		}
	})()

	cameraSelectacon.onSelected(selected => {
		orbitcam.pivot = board.localize(
			selected
				? selected.place
				: Place.coords(0, 0),
		)
	})
	cameraSelectacon.select(new Place([3, 3]))

	const rightMouseDrags = new DragQueen({
		predicate: event => event.button === 2,
		onAnyDrag: () => {},
		onAnyClick: () => {},
		onIndentedDrag: orbitcam.drag,
		onIndentedClick: event => {
			const {pickedMesh} = scene.pick(
				event.clientX,
				event.clientY,
				mesh => board.isPickable(mesh),
			)
			if (pickedMesh) {
				const place = board.pick(pickedMesh)
				cameraSelectacon.select(place)
			}
		},
	})

	const middleMouseDrags = new DragQueen({
		predicate: event => event.button === 1,
		onAnyClick: () => {},
		onIndentedDrag: () => {},
		onIndentedClick: () => {},
		onAnyDrag: ({movementX, movementY}) => {
			const panningSensitivity = 2 / 100
			const movement = [movementX, movementY] as Vec2
			orbitcam.pivot = (
				Pipe.with(movement)
					.to(v => vec2.rotate(v, orbitcam.camera.alpha + scalar.radians.from.degrees(90)))
					.to(v => vec2.multiplyBy(v, panningSensitivity))
					.to(([x, z]) => [x, 0, z] as Vec3)
					.to(v => vec3.add(orbitcam.pivot, v))
					.to(v => board.clampPosition(v))
					.done()
			)
		},
	})

	const stopRmb = ev(world.canvas, rightMouseDrags.events)
	const stopMmb = ev(world.canvas, middleMouseDrags.events)
	const stopContextMenuPrevention = ev(document, {contextmenu: (e: Event) => e.preventDefault()})

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
			stopRmb()
			stopMmb()
			stopContextMenuPrevention()
			envmap.dispose()
			world.dispose()
			disposeOrbit()
		},
	}
}

