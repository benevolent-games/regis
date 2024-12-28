
import {Pointing} from "./types.js"
import {Vec2, Vec3, Scalar, Degrees} from "@benev/toolbox"
import {ArcRotateCamera, Scene, Vector3} from "@babylonjs/core"
import {Smoothie, Smoothie2, Smoothie3} from "../../tools/smoothies.js"

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

	#gimbal = new Smoothie2(new Vec2(0, 0))
	#pivot = new Smoothie3(new Vec3(0, 0, 0))
	#zoom = new Smoothie(30)
	#fraction: number

	constructor(private options: Options) {
		this.#fraction = 1 / options.smoothing
		const name = "orbitcam"
		const alpha = 0
		const beta = 0
		const radius = this.#zoom.target
		const target = new Vector3(...this.#pivot.target.array())
		this.camera = new ArcRotateCamera(name, alpha, beta, radius, target, options.scene)
		this.dispose = () => this.camera.dispose()
		this.gimbal = new Vec2(0, Degrees.toRadians(45))
	}

	get gimbal() {
		return this.#gimbal.target
	}

	set gimbal({x, y}: Vec2) {
		const range = this.options.verticalRange
		this.#gimbal.target.x = x
		this.#gimbal.target.y = Scalar.clamp(y, range.x, range.y)
	}

	get pivot() {
		return this.#pivot.target
	}

	set pivot(v: Vec3) {
		this.#pivot.target = v
	}

	get topdownness() {
		const {y} = this.#gimbal.smooth
		const range = this.options.verticalRange
		return Scalar.inverse(
			Scalar.remap(y, range.x, range.y)
		)
	}

	get zoomedoutness() {
		const range = this.options.zoomRange
		return Scalar.remap(this.#zoom.smooth, range.x, range.y)
	}

	#updateZoom() {
		this.camera.radius = this.#zoom.update(this.#fraction)
	}

	#updateGimbal() {
		const {x, y} = this.#gimbal.update(this.#fraction)
		this.camera.alpha = x
		this.camera.beta = y
	}

	#updatePivot() {
		let pivot = this.#pivot.update(this.#fraction)
		const closeupness = Scalar.inverse(this.zoomedoutness)
		const addedHeight = closeupness * this.options.zoomAddsPivotHeight
		if (this.options.straightenAtTop) {
			const zeroed = new Vec3(0, 0, 0)
			const centeredness = this.topdownness * this.zoomedoutness
			pivot = new Vec3(
				Scalar.map(centeredness, pivot.x, zeroed.x),
				Scalar.map(centeredness, pivot.y, zeroed.y),
				Scalar.map(centeredness, pivot.z, zeroed.z),
			)
		}
		this.camera.target.set(
			...pivot
				.clone()
				.add_(0, addedHeight, 0)
				.array()
		)
	}

	tick = () => {
		this.#updateGimbal()
		this.#updatePivot()
		this.#updateZoom()
	}

	wheel = (event: WheelEvent) => {
		const range = this.options.zoomRange
		this.#zoom.target += event.deltaY * this.options.zoomSensitivity
		this.#zoom.target = Scalar.clamp(this.#zoom.target, range.x, range.y)
	}

	drag = (event: Pointing) => {
		const {x, y} = this.gimbal
		this.gimbal = new Vec2(
			x + (event.movementX * this.options.orbitSensitivity),
			y - (event.movementY * this.options.orbitSensitivity),
		)
	}
}

