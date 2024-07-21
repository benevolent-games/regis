
import {ev, Pipe} from "@benev/slate"
import {human, scalar, vec2, Vec2, vec3, Vec3} from "@benev/toolbox"

import {Visualizer} from "./visualizer.js"
import {Trashbin} from "../../tools/trashbin.js"
import {DragQueen} from "../../tools/drag-queen.js"
import {AgentState} from "../../logic/state/game.js"
import {boundaries} from "../../logic/helpers/boundaries.js"
import {coordinator} from "../../logic/helpers/coordinator.js"

export function makeControls(visualizer: Visualizer, getState: () => AgentState) {
	const {world, orbitcam} = visualizer

	const state = {
		get board() { return getState().board },
	}

	function setCameraPivot(place: Vec2) {
		orbitcam.pivot = coordinator(state.board).toPosition(place)
	}

	function grab(event: PointerEvent) {
		const {pickedMesh} = visualizer.world.scene.pick(
			event.clientX,
			event.clientY,
			mesh => visualizer.tiles.blockPlacements.has(mesh),
		)
		if (pickedMesh)
			return visualizer.tiles.blockPlacements.get(pickedMesh)!
	}

	const rightMouseDrags = new DragQueen({
		predicate: event => event.button === 2,
		onAnyDrag: () => {},
		onAnyClick: () => {},
		onIntendedDrag: orbitcam.drag,
		onIntendedClick: event => {
			const place = grab(event)
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
					.to(v => boundaries(state.board).clampPosition(v))
					.to(v => {
						const c = coordinator(state.board)
						const place = c.toPlace(v)
						const [,y] = c.toPosition(place)
						const [x,,z] = v
						return [x, y, z] as Vec3
					})
					.done()
			)
		},
	})

	const trashbin = new Trashbin()
	trashbin.disposer(ev(world.canvas, rightMouseDrags.events))
	trashbin.disposer(ev(world.canvas, middleMouseDrags.events))
	trashbin.disposer(ev(document, {contextmenu: (e: Event) => e.preventDefault()}))

	return {
		dispose: trashbin.dispose,
	}
}

