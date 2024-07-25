
import {ev, Pipe} from "@benev/slate"
import {scalar, vec2, Vec2, vec3, Vec3} from "@benev/toolbox"

import {World} from "./parts/world.js"
import {FnPickTilePlace} from "./types.js"
import {Orbitcam} from "./parts/orbitcam.js"
import {Trashbin} from "../../tools/trashbin.js"
import {Agent} from "../../logic2/helpers/agent.js"
import {DragQueen} from "../../tools/drag-queen.js"

const {degrees} = scalar.radians.from

export function makeCameraVisuals(agent: Agent, world: World, pick: FnPickTilePlace) {
	const orbitcam = new Orbitcam({
		scene: world.scene,
		smoothing: 7,
		zoomRange: [3, 50],
		straightenAtTop: false,
		zoomAddsPivotHeight: 2,
		zoomSensitivity: 3 / 100,
		orbitSensitivity: 5 / 1000,
		verticalRange: [degrees(0), degrees(90)],
	})

	orbitcam.gimbal = [degrees(90), degrees(45)]
	world.rendering.setCamera(orbitcam.camera)

	const cancelLoop = world.gameloop.on(orbitcam.tick)
	const mechanics = cameraMechanics(agent, world, orbitcam, pick)

	return {
		orbitcam,
		dispose() {
			mechanics.dispose()
			if (world.rendering.camera === orbitcam.camera)
				world.rendering.setCamera(null)
			cancelLoop()
			orbitcam.dispose()
		},
	}
}

function cameraMechanics(agent: Agent, world: World, orbitcam: Orbitcam, pick: FnPickTilePlace) {
	const trashbin = new Trashbin()
	const dr = trashbin.disposer

	function setCameraPivot(place: Vec2) {
		orbitcam.pivot = agent.coordinator.toPosition(place)
	}

	const rightMouseDrags = new DragQueen({
		predicate: event => event.button === 2,
		onAnyDrag: () => {},
		onAnyClick: () => {},
		onIntendedDrag: orbitcam.drag,
		onIntendedClick: event => {
			const place = pick(event)
			if (place)
				setCameraPivot(place)
		},
	})

	const middleMouseDrags = new DragQueen({
		predicate: event => event.button === 1,
		onAnyClick: () => {},
		onIntendedDrag: () => {},
		onIntendedClick: () => {},
		onAnyDrag: ({movementX, movementY}) => {
			const panningSensitivity = 2 / 100
			const movement = [movementX, movementY] as Vec2
			orbitcam.pivot = (
				Pipe.with(movement)
					.to(v => vec2.rotate(
						v,
						orbitcam.camera.alpha + scalar.radians.from.degrees(90)
					))
					.to(v => vec2.multiplyBy(v, panningSensitivity))
					.to(([x, z]) => [x, 0, z] as Vec3)
					.to(v => vec3.add(orbitcam.pivot, v))
					.to(v => agent.boundary.clampPosition(v))
					.to(v => {
						const place = agent.coordinator.toPlace(v)
						const [,y] = agent.coordinator.toPosition(place)
						const [x,,z] = v
						return [x, y, z] as Vec3
					})
					.done()
			)
		},
	})

	dr(ev(world.canvas, {wheel: orbitcam.wheel}))
	dr(ev(world.canvas, rightMouseDrags.events))
	dr(ev(world.canvas, middleMouseDrags.events))
	dr(ev(document, {contextmenu: (e: Event) => e.preventDefault()}))

	return {dispose: trashbin.dispose}
}

