
import {PointerCaptor} from "./pointer-captor.js"

type Activity = {
	movement: number
	startTime: number
}

type Options = {
	predicate: (event: PointerEvent) => boolean
	onIndentedDrag: (event: PointerEvent, activity: Activity) => void
	onIndentedClick: (event: PointerEvent, activity: Activity) => void
	onAnyDrag: (event: PointerEvent, activity: Activity) => void
	onAnyClick: (event: PointerEvent, activity: Activity) => void
}

/** differentiate clicks vs drags for pointerevents */
export class DragQueen {
	constructor(private options: Options) {}

	#activity: Activity | null = null
	#pointerCaptor = new PointerCaptor()

	get dragDetected() {
		if (this.#activity) {
			const {movement, startTime} = this.#activity
			const duration = Date.now() - startTime
			const movementThreshold = Math.max(10, 100 - (0.4 * (duration - 100)))
			const isSlow = duration > 100
			const isBigMovement = movement > movementThreshold
			return isSlow && isBigMovement
		}
		return false
	}

	#cancelActivity = () => {
		this.#activity = null
		this.#pointerCaptor.release()
	}

	events = {
		pointerdown: (event: PointerEvent) => {
			if (this.options.predicate(event)) {
				this.#activity = {movement: 0, startTime: Date.now()}
				this.#pointerCaptor.capture(event)
			}
		},
		pointermove: (event: PointerEvent) => {
			if (this.#activity) {
				this.#activity.movement += Math.abs(event.movementX)
				this.#activity.movement += Math.abs(event.movementY)
				this.options.onAnyDrag(event, this.#activity)
				if (this.dragDetected)
					this.options.onIndentedDrag(event, this.#activity)
			}
		},
		pointerup: (event: PointerEvent) => {
			if (this.#activity) {
				this.options.onAnyClick(event, this.#activity)
				if (!this.dragDetected)
					this.options.onIndentedClick(event, this.#activity)
			}
			this.#cancelActivity()
		},
		blur: this.#cancelActivity,
		pointerleave: this.#cancelActivity,
	}
}

