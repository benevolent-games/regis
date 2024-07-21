
import {ev} from "@benev/slate"
import {AgentState} from "../../../logic/state/game.js"
import {Visualizer} from "../../visualizer/visualizer.js"

export function attachSelectionMechanic(visualizer: Visualizer, getState: () => AgentState) {
	return ev(visualizer.world.canvas, {
		pointerdown: (event: PointerEvent) => {
			if (event.button !== 0)
				return
			const place = visualizer.tileRenderer.pick(event)
			if (place)
				visualizer.selectionRenderer.select(getState().board, place)
		},
	})
}

