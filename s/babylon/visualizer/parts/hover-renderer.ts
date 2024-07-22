
import {Vec2} from "@benev/toolbox"
import {Viz} from "../viz.js"

export function makeHoverRenderer({agent, chessGlb}: Viz) {
	let wipe = () => {}

	function hover(teamId: number, place: Vec2 | undefined) {
		wipe()
		if (place) {
			const position = agent.coordinator.toPosition(place)
			const instance = chessGlb.indicatorHover(teamId)
			instance.position.set(...position)
			wipe = () => instance.dispose()
		}
	}

	return {
		hover,
		dispose: wipe,
	}
}

