
import {ev, Pipe, Trashbin} from "@benev/slate"
import {scalar, vec2, Vec2, vec3, Vec3} from "@benev/toolbox"

import {World} from "./world.js"
import {Pointing} from "./types.js"
import {CameraRig} from "./camera-rig.js"
import {Selectacon} from "./selectacon.js"
import {Agent} from "../../logic/agent.js"
import {Planner} from "../planner/planner.js"
import {UnitKind} from "../../logic/state.js"
import {DragQueen} from "../../tools/drag-queen.js"
import {TerminalActions} from "./terminal-actions.js"
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
			actions: TerminalActions
		}) {

		const {cameraRig, actions, turnTracker} = options
		const {canvas} = options.world
		const dr = this.#trashbin.disposer

		dr(ev(canvas, this.leftMouse.events))
		dr(ev(canvas, this.rightMouse.events))
		dr(ev(canvas, this.middleMouse.events))
		dr(ev(canvas, {contextmenu: (e: Event) => e.preventDefault()}))
		dr(ev(canvas, {wheel: cameraRig.orbitcam.wheel}))
		dr(ev(canvas, {wheel: cameraRig.orbitcam.wheel}))

		// roster select hotkeys
		dr(ev(window, {
			keydown: (event: KeyboardEvent) => {
				const select = (unitKind: UnitKind): void => {
					actions.selectRosterUnit(turnTracker.teamId, unitKind)
				}
				switch (event.code) {
					// case "KeyE": return select("pawn")
					// case "KeyW": return select("knight")
					// case "KeyD": return select("rook")
					// case "KeyS": return select("bishop")
					// case "KeyA": return select("queen")

					case "Digit1": return select("pawn")
					case "Digit2": return select("knight")
					case "Digit3": return select("rook")
					case "Digit4": return select("bishop")
					case "Digit5": return select("queen")

					case "KeyQ": return select("pawn")
					case "KeyW": return select("knight")
					case "KeyE": return select("rook")
					case "KeyR": return select("bishop")
					case "KeyT": return select("queen")

					case "KeyA": return select("pawn")
					case "KeyS": return select("knight")
					case "KeyD": return select("rook")
					case "KeyF": return select("bishop")
					case "KeyG": return select("queen")
				}
			},
		}))

		// ctrl+z wipe turn plan
		dr(ev(window, {
			keydown: (event: KeyboardEvent) => {
				if (event.code === "KeyZ" && event.ctrlKey)
					actions.resetPreview()
			},
		}))

		// spacebar to execute turn
		dr(ev(window, {
			keydown: (event: KeyboardEvent) => {
				const {turnTracker, agent} = this.options
				if (event.code === "Space" && !agent.conclusion && turnTracker.ourTurn)
					actions.commitTurn()
			},
		}))
	}

	antics = {
		select: (pointing: Pointing) => {
			const {selectacon} = this.options
			const target = selectacon.pick(pointing)
			selectacon.selection.value = target
		},

		rotateOrbitcam: (pointing: Pointing) => {
			this.options.cameraRig.orbitcam.drag(pointing)
		},

		actuateAction: (pointing: Pointing) => {
			handlePrimaryClick({...this.options, pointing})
		},

		setNewCameraPivot: (pointing: Pointing) => {
			const {selectacon, cameraRig} = this.options
			const cell = selectacon.pick(pointing)
			if (cell)
				cameraRig.orbitcam.pivot = cell.position
		},

		panningCameraPivot: (pointing: Pointing) => {
			const {movementX, movementY} = pointing
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
	}

	leftMouse = new DragQueen({
		predicate: event => event.button === 0,
		onAnyDrag: () => {},
		onAnyClick: () => {},
		onIntendedDrag: this.antics.rotateOrbitcam,
		onIntendedClick: this.antics.select,
	})

	rightMouse = new DragQueen({
		predicate: event => event.button === 2,
		onAnyDrag: () => {},
		onAnyClick: () => {},
		onIntendedDrag: this.antics.rotateOrbitcam,
		onIntendedClick: this.antics.actuateAction,
	})

	middleMouse = new DragQueen({
		predicate: event => event.button === 1,
		onAnyClick: () => {},
		onAnyDrag: this.antics.panningCameraPivot,
		onIntendedDrag: () => {},
		onIntendedClick: this.antics.setNewCameraPivot,
	})
}

