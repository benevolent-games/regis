
import {Vec2} from "@benev/toolbox"
import {Viz} from "../viz.js"
import {Trashbin} from "../../../tools/trashbin.js"

export function makeSelectionRenderer({agent, chessGlb}: Viz) {
	const trashbin = new Trashbin()

	function select(place: Vec2 | undefined) {
		trashbin.dispose()
		if (place) {
			const position = agent.coordinator.toPosition(place)
			const instance = chessGlb.indicatorSelection()
			instance.position.set(...position)
			trashbin.disposable(instance)
		}
	}

	return {
		select,
		dispose: trashbin.dispose,
	}
}

