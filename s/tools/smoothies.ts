
import {Scalar, Vec2, Vec3} from "@benev/toolbox"

export class Smoothie {
	smooth: number

	constructor(public target: number) {
		this.smooth = target
	}

	update(fraction: number) {
		this.smooth = Scalar.lerp(this.smooth, this.target, fraction)
		return this.smooth
	}

	hardSet(x: number) {
		this.target = x
		this.smooth = x
	}
}

export class Smoothie2 {
	smooth: Vec2

	constructor(public target: Vec2) {
		this.smooth = target.clone()
	}

	update(fraction: number) {
		this.smooth.lerp(this.target, fraction)
		return this.smooth
	}

	hardSet(v: Vec2) {
		this.target.set(v)
		this.smooth.set(v)
	}
}

export class Smoothie3 {
	smooth: Vec3

	constructor(public target: Vec3) {
		this.smooth = target.clone()
	}

	update(fraction: number) {
		this.smooth.lerp(this.target, fraction)
		return this.smooth
	}

	hardSet(v: Vec3) {
		this.target.set(v)
		this.smooth.set(v)
	}
}

