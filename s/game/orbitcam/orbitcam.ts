
import {molasses2d, scalar, Vec2} from "@benev/toolbox"
import {PointerCaptor} from "../../tools/pointer-captor.js"
import {ArcRotateCamera, Scene, Vector3} from "@babylonjs/core"

const {degrees} = scalar.radians.from

type Options = {
	scene: Scene
	sensitivity: number
	smoothing: number
	verticalRange: Vec2
	verticalRadii: Vec2
}

export class Orbitcam {
	readonly camera: ArcRotateCamera
	dispose: () => void

	#down = false
	#gimbal: Vec2 = [0, 0]
	#smoothedGimbal: Vec2 = [0, 0]

	constructor(private options: Options) {
		const name = "orbitcam"
		const alpha = 0
		const beta = 0
		const radius = 20
		const target = new Vector3(0, 1, 0)
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

	tick = () => {
		this.#smoothedGimbal = molasses2d(
			this.options.smoothing,
			this.#smoothedGimbal,
			this.#gimbal,
		)
		this.#setCameraToGimbal(this.#smoothedGimbal)
	}

	#setCameraToGimbal([x, y]: Vec2) {
		this.camera.alpha = x
		this.camera.beta = y
		this.camera.radius = scalar.remap(
			y,
			this.options.verticalRange,
			this.options.verticalRadii,
		)
	}

	#pointerCaptor = new PointerCaptor()

	#cancel = () => {
		this.#down = false
		this.#pointerCaptor.release()
	}

	events = {
		pointerdown: (event: PointerEvent) => {
			this.#down = true
			this.#pointerCaptor.capture(event)
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

