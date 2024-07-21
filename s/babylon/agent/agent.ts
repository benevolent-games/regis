
import {ev, Pipe} from "@benev/slate"
import {scalar, vec2, Vec2, vec3, Vec3} from "@benev/toolbox"

import {Trashbin} from "../../tools/trashbin.js"
import {DragQueen} from "../../tools/drag-queen.js"
import {AgentState} from "../../logic/state/game.js"
import {Visualizer} from "../visualizer/visualizer.js"
import {boundaries} from "../../logic/helpers/boundaries.js"
import {coordinator} from "../../logic/helpers/coordinator.js"

export function makeAgent({playAsTeams, visualizer, getState}: {
		playAsTeams: number[]
		visualizer: Visualizer
		getState: () => AgentState
	}) {

	const trashbin = new Trashbin()
	const d = trashbin.disposable
	const dr = trashbin.disposer

	const {world, orbitcam} = visualizer

	const state = {
		get board() { return getState().board },
		get context() { return getState().context },
	}

	let lastHoverPoint: undefined | {clientX: number, clientY: number}

	dr(ev(world.canvas, {
		pointermove: ({clientX, clientY}: PointerEvent) => {
			lastHoverPoint = {clientX, clientY}
		},
	}))

	dr(world.gameloop.on(() => {
		if (lastHoverPoint) {
			const place = visualizer.tileRenderer.pick(lastHoverPoint)
			visualizer.hoverRenderer.hover(state.board, state.context.currentTurn, place)
		}
	}))

	function setCameraPivot(place: Vec2) {
		orbitcam.pivot = coordinator(state.board).toPosition(place)
	}

	// const leftClicks = {
	// 	pointerdown: (event: PointerEvent) => {
	// 		if (event.button !== 0)
	// 			return
	// 		console.log("leftclick!")
	// 	},
	// }

	const rightMouseDrags = new DragQueen({
		predicate: event => event.button === 2,
		onAnyDrag: () => {},
		onAnyClick: () => {},
		onIntendedDrag: orbitcam.drag,
		onIntendedClick: event => {
			const place = visualizer.tileRenderer.pick(event)
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

	dr(ev(world.canvas, {wheel: orbitcam.wheel}))
	dr(ev(world.canvas, rightMouseDrags.events))
	dr(ev(world.canvas, middleMouseDrags.events))
	dr(ev(document, {contextmenu: (e: Event) => e.preventDefault()}))


	return {
		dispose: trashbin.dispose,
	}
}

