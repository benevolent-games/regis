
import {Viz} from "../viz.js"
import {Trashbin} from "../../../tools/trashbin.js"

export function makeSelectionRenderer({agent, chessGlb, party}: Viz) {
	const trashbin = new Trashbin()

	function render() {
		trashbin.dispose()
		const selection = party.state.selection

		if (selection) {
			const position = agent.coordinator.toPosition(selection.place)
			const instance = chessGlb.indicatorSelection()
			instance.position.set(...position)
			trashbin.disposable(instance)
		}
	}

	return {
		render,
		dispose: trashbin.dispose,
	}
}

