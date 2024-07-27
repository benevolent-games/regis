
import {scalar, Vec2, vec3, Vec3} from "@benev/toolbox"
import {ArcRotateCamera, Scene, Vector3} from "@babylonjs/core"

import {Smooth, SmoothVector} from "../../tools/smooth.js"

const {degrees} = scalar.radians.from

type Options = {
	scene: Scene
	smoothing: number
	verticalRange: Vec2
	orbitSensitivity: number
	zoomRange: Vec2
	zoomSensitivity: number
	zoomAddsPivotHeight: number
	straightenAtTop: boolean
}

export class Orbitcam {
	readonly camera: ArcRotateCamera
	dispose: () => void

	#gimbal = new SmoothVector<Vec2>(10, [0, 0])
	#pivot = new SmoothVector<Vec3>(10, [0, 0, 0])
	#zoom = new Smooth(10, 30)

	constructor(private options: Options) {
		const name = "orbitcam"
		const alpha = 0
		const beta = 0
		const radius = this.#zoom.smooth
		const target = new Vector3(...this.#pivot.smooth)
		this.#zoom.smoothing = options.smoothing
		this.camera = new ArcRotateCamera(name, alpha, beta, radius, target, options.scene)
		this.dispose = () => this.camera.dispose()
		this.gimbal = [0, degrees(45)]
	}

	get gimbal() {
		return this.#gimbal.target
	}

	set gimbal([x, y]: Vec2) {
		this.#gimbal.target = [
			x,
			scalar.clamp(
				y,
				...this.options.verticalRange,
			),
		]
	}

	get pivot() {
		return this.#pivot.target
	}

	set pivot(v: Vec3) {
		this.#pivot.target = v
	}

	get topdownness() {
		const [,y] = this.#gimbal.smooth
		return scalar.inverse(
			scalar.remap(y, this.options.verticalRange)
		)
	}

	get zoomedoutness() {
		return scalar.remap(this.#zoom.smooth, this.options.zoomRange)
	}

	#updateZoom() {
		this.camera.radius = this.#zoom.tick()
	}

	#updateGimbal() {
		const [x, y] = this.#gimbal.tick()
		this.camera.alpha = x
		this.camera.beta = y
	}

	#updatePivot() {
		let pivot = this.#pivot.tick()
		const closeupness = scalar.inverse(this.zoomedoutness)
		const addedHeight = closeupness * this.options.zoomAddsPivotHeight
		if (this.options.straightenAtTop) {
			const zeroed: Vec3 = [0, 0, 0]
			const centeredness = this.topdownness * this.zoomedoutness
			pivot = [
				scalar.map(centeredness, [pivot[0], zeroed[0]]),
				scalar.map(centeredness, [pivot[1], zeroed[1]]),
				scalar.map(centeredness, [pivot[2], zeroed[2]]),
			]
		}
		this.camera.target.set(...vec3.add(pivot, [0, addedHeight, 0]))
	}

	tick = () => {
		this.#updateGimbal()
		this.#updatePivot()
		this.#updateZoom()
	}

	wheel = (event: WheelEvent) => {
		this.#zoom.target += event.deltaY * this.options.zoomSensitivity
		this.#zoom.target = scalar.clamp(this.#zoom.target, ...this.options.zoomRange)
	}

	drag = (event: PointerEvent) => {
		const [x, y] = this.gimbal
		this.gimbal = [
			x + (event.movementX * this.options.orbitSensitivity),
			y - (event.movementY * this.options.orbitSensitivity),
		]
	}
}

