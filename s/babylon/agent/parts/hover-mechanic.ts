
import {ev} from "@benev/slate"
import {AgentState} from "../../../logic/state/game.js"
import {Visualizer} from "../../visualizer/visualizer.js"

export function attachHoverMechanic(visualizer: Visualizer, getState: () => AgentState) {
	const state = {
		get board() { return getState().board },
		get context() { return getState().context },
	}

	let lastHoverPoint: undefined | {clientX: number, clientY: number}

	const stopListening = ev(visualizer.world.canvas, {
		pointermove: ({clientX, clientY}: PointerEvent) => {
			lastHoverPoint = {clientX, clientY}
		},
	})

	const stopLooping = visualizer.world.gameloop.on(() => {
		if (lastHoverPoint) {
			const place = visualizer.tileRenderer.pick(lastHoverPoint)
			visualizer.hoverRenderer.hover(state.board, state.context.currentTurn, place)
		}
	})

	function dispose() {
		stopListening()
		stopLooping()
	}

	return dispose
}

