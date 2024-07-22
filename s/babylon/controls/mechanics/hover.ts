
import {ev} from "@benev/slate"
import {Agent} from "../../../logic/agent.js"
import {Visualizer} from "../../visualizer/visualizer.js"

export function attachHoverMechanic(visualizer: Visualizer, agent: Agent) {
	let lastHoverPoint: undefined | {clientX: number, clientY: number}

	const stopListening = ev(visualizer.world.canvas, {
		pointermove: ({clientX, clientY}: PointerEvent) => {
			lastHoverPoint = {clientX, clientY}
		},
	})

	const stopLooping = visualizer.world.gameloop.on(() => {
		if (lastHoverPoint) {
			const place = visualizer.tileRenderer.pick(lastHoverPoint)
			visualizer.hoverRenderer.hover(agent.state.context.currentTurn, place)
		}
	})

	function dispose() {
		stopListening()
		stopLooping()
	}

	return dispose
}

