
export function smooth(
		smoothing: number,
		target: number,
		smoothed: number,
	) {

	return smoothing <= 1
		? target
		: smoothed + ((target - smoothed) / smoothing)
}

export class Smoothie {
	smoothed: number

	constructor(public smoothing: number, public target: number) {
		this.smoothed = target
	}

	tick() {
		return this.smoothed = smooth(this.smoothing, this.target, this.smoothed)
	}
}

export class SmoothieVector<V extends number[]> {
	smoothed: V

	constructor(public smoothing: number, public target: V) {
		this.smoothed = target
	}

	tick() {
		return this.smoothed = (
			this.smoothed.map((x, i) => smooth(this.smoothing, this.target[i], x))
		) as V
	}
}

