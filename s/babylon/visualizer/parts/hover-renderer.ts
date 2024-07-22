
import {Viz} from "../viz.js"

export function makeHoverRenderer({agent, chessGlb, party}: Viz) {
	let wipe = () => {}

	function render() {
		wipe()
		const hovering = party.state.hover

		if (hovering) {
			const {teamId, place} = hovering
			const position = agent.coordinator.toPosition(place)
			const instance = chessGlb.indicatorHover(teamId)
			instance.position.set(...position)
			wipe = () => instance.dispose()
		}
	}

	return {
		render,
		dispose: wipe,
	}
}

