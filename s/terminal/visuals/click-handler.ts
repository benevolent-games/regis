
import {ev} from "@benev/slate"
import {World} from "./parts/world.js"
import {Traversal} from "./traversal.js"
import {Selectacon} from "./selectacon.js"
import {FnPickTilePlace} from "./types.js"

export class ClickHandler {
	#stop: () => void

	constructor(private options: {
			world: World
			traversal: Traversal
			selectacon: Selectacon
			pick: FnPickTilePlace
		}) {
		this.#stop = ev(options.world.canvas, this.#events)
	}

	#events = {
		pointerdown: (event: PointerEvent) => {
			if (event.button !== 0)
				return

			const {selectacon, traversal, pick} = this.options
			const {selection} = selectacon
			const clickedPlace = pick(event) ?? null

			const movementHappened = (
				clickedPlace &&
				selection?.unit &&
				traversal.attemptMove(selection.place, clickedPlace)
			)

			if (!movementHappened)
				selectacon.select(clickedPlace ?? null)
		},
	}

	dispose() {
		this.#stop()
	}
}

