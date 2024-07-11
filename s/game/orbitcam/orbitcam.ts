
import {molasses2d, molasses3d, scalar, spline, Vec2, Vec3} from "@benev/toolbox"
import {ArcRotateCamera, Scene, Vector3} from "@babylonjs/core"

import {PointerCaptor} from "../../tools/pointer-captor.js"

const {degrees} = scalar.radians.from

type Options = {
	scene: Scene
	sensitivity: number
	smoothing: number
	verticalRange: Vec2
	zoomSpline: number[]
}

export class Orbitcam {
	readonly camera: ArcRotateCamera
	dispose: () => void

	#down = false

	#gimbal: Vec2 = [0, 0]
	#smoothedGimbal = this.#gimbal

	pivot: Vec3 = [0, 1, 0]
	#smoothedPivot = this.pivot

	constructor(private options: Options) {
		const name = "orbitcam"
		const alpha = 0
		const beta = 0
		const radius = 20
		const target = new Vector3(...this.#smoothedPivot)
		this.camera = new ArcRotateCamera(name, alpha, beta, radius, target, options.scene)
		this.dispose = () => this.camera.dispose()
		this.gimbal = [0, degrees(45)]
	}

	get gimbal() {
		return this.#gimbal
	}

	set gimbal([x, y]: Vec2) {
		this.#gimbal = [
			x,
			scalar.clamp(
				y,
				...this.options.verticalRange,
			),
		]
	}

	get verticalProgress() {
		const [,y] = this.#smoothedGimbal
		return scalar.remap(y, this.options.verticalRange)
	}

	#applySmoothGimbal() {
		this.#smoothedGimbal = molasses2d(
			this.options.smoothing,
			this.#smoothedGimbal,
			this.#gimbal,
		)
		const [x, y] = this.#smoothedGimbal
		this.camera.alpha = x
		this.camera.beta = y
		this.camera.radius = spline.ez.linear(
			this.verticalProgress,
			this.options.zoomSpline,
		)
	}

	#applySmoothPivot() {
		const realpivot = this.#smoothedPivot = molasses3d(
			this.options.smoothing,
			this.#smoothedPivot,
			this.pivot,
		)
		const zeroed: Vec3 = [0, 0, 0]
		const {verticalProgress} = this
		this.camera.target.set(
			scalar.map(verticalProgress, [zeroed[0], realpivot[0]]),
			scalar.map(verticalProgress, [zeroed[1], realpivot[1]]),
			scalar.map(verticalProgress, [zeroed[2], realpivot[2]]),
		)
	}

	tick = () => {
		this.#applySmoothGimbal()
		this.#applySmoothPivot()
	}

	#pointerCaptor = new PointerCaptor()

	#cancel = () => {
		this.#down = false
		this.#pointerCaptor.release()
	}

	events = {
		pointerdown: (event: PointerEvent) => {
			if (event.button === 2) {
				this.#down = true
				this.#pointerCaptor.capture(event)
			}
		},

		pointermove: (event: PointerEvent) => {
			if (this.#down) {
				const [x, y] = this.gimbal
				this.gimbal = [
					x + (event.movementX * this.options.sensitivity),
					y - (event.movementY * this.options.sensitivity),
				]
			}
		},

		pointerleave: this.#cancel,
		pointerup: this.#cancel,
		blur: this.#cancel,
	}
}

