
import {ev} from "@benev/slate"
import {Visualizer} from "../../visualizer/visualizer.js"

export class SelectionMechanic {
	dispose: () => void

	#events = {
		pointerdown: (event: PointerEvent) => {
			if (event.button !== 0)
				return
			const place = this.visualizer.pickTile(event)
			if (place)
				this.visualizer.party.select(place)
		},
	}

	constructor(public visualizer: Visualizer) {
		this.dispose = ev(visualizer.world.canvas, this.#events)
	}
}

export function attachSelectionMechanic(visualizer: Visualizer) {
	return ev(visualizer.world.canvas, {
		pointerdown: (event: PointerEvent) => {
			if (event.button !== 0)
				return
			visualizer.party.select(
				visualizer.pickTile(event)
			)
		},
	})
}

