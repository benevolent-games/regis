
import {ev, Pipe, Trashbin} from "@benev/slate"
import {scalar, vec2, Vec2, vec3, Vec3} from "@benev/toolbox"

import {World} from "./world.js"
import {CameraRig} from "./camera-rig.js"
import {Selectacon} from "./selectacon.js"
import {Agent} from "../../logic/agent.js"
import {Planner} from "../planner/planner.js"
import {DragQueen} from "../../tools/drag-queen.js"
import {handlePrimaryClick} from "./handle-primary-click.js"
import {TurnTracker} from "../../logic/simulation/aspects/turn-tracker.js"

export class UserInputs {
	#trashbin = new Trashbin()

	dispose = this.#trashbin.dispose

	constructor(private options: {
			agent: Agent
			world: World
			planner: Planner
			cameraRig: CameraRig
			selectacon: Selectacon
			turnTracker: TurnTracker
			resetPreview: () => void
		}) {

		const {planner, cameraRig, resetPreview} = options
		const {canvas} = options.world
		const dr = this.#trashbin.disposer

		dr(ev(canvas, this.leftMouse.events))
		dr(ev(canvas, this.rightMouse.events))
		dr(ev(canvas, this.middleMouse.events))
		dr(ev(document, {contextmenu: (e: Event) => e.preventDefault()}))
		dr(ev(canvas, {wheel: cameraRig.orbitcam.wheel}))
		dr(ev(canvas, {wheel: cameraRig.orbitcam.wheel}))

		// ctrl+z wipe turn plan
		dr(ev(window, {
			keydown: (event: KeyboardEvent) => {
				if (event.code === "KeyZ" && event.ctrlKey) {
					resetPreview()
				}
			},
		}))

		dr(ev(window, {
			keydown: (event: KeyboardEvent) => {
				const {turnTracker, agent} = this.options
				if (event.code === "Space" && !agent.conclusion && turnTracker.ourTurn)
					planner.executePlan()
			},
		}))
	}

	leftMouse = new DragQueen({
		predicate: event => event.button === 0,
		onAnyDrag: () => {},
		onIntendedDrag: () => {},
		onIntendedClick: () => {},
		onAnyClick: event => handlePrimaryClick({
			...this.options,
			pointing: event,
		}),
	})

	rightMouse = new DragQueen({
		predicate: event => event.button === 2,
		onAnyDrag: () => {},
		onAnyClick: () => {},

		// rotate camera orbit
		onIntendedDrag: event => {
			this.options.cameraRig.orbitcam.drag(event)
		},

		// click-move camera pivot
		onIntendedClick: event => {
			const {selectacon, cameraRig} = this.options
			const cell = selectacon.pick(event)
			if (cell)
				cameraRig.orbitcam.pivot = cell.position
		},
	})

	middleMouse = new DragQueen({
		predicate: event => event.button === 1,
		onAnyClick: () => {},
		onIntendedDrag: () => {},
		onIntendedClick: () => {},

		// panning
		onAnyDrag: ({movementX, movementY}) => {
			const {agent, cameraRig: {orbitcam}} = this.options
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
}

