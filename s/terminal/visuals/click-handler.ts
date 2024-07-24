
import {ev} from "@benev/slate"
import {Vec2} from "@benev/toolbox"

import {World} from "./parts/world.js"
import {FnPickTilePlace} from "./types.js"

export class ClickHandler {
	#stop: () => void

	constructor(private options: {
			world: World
			pick: FnPickTilePlace
			onPlaceClick: (place: Vec2 | null) => void
		}) {
		this.#stop = ev(options.world.canvas, this.#events)
	}

	#events = {
		pointerdown: (event: PointerEvent) => {
			if (event.button !== 0)
				return
			const {pick, onPlaceClick} = this.options
			onPlaceClick(pick(event) ?? null)
		},
	}

	dispose() {
		this.#stop()
	}
}

