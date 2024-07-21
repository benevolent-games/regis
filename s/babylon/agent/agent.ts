
import {Trashbin} from "../../tools/trashbin.js"
import {AgentState} from "../../logic/state/game.js"
import {Visualizer} from "../visualizer/visualizer.js"
import {attachHoverMechanic} from "./parts/hover-mechanic.js"
import {attachCameraControls} from "./parts/camera-controls.js"
import {attachSelectionMechanic} from "./parts/selection-mechanic.js"

export function makeAgent({playAsTeams, visualizer, getState}: {
		playAsTeams: number[]
		visualizer: Visualizer
		getState: () => AgentState
	}) {

	const trashbin = new Trashbin()
	const dr = trashbin.disposer

	dr(attachCameraControls(visualizer, getState))
	dr(attachHoverMechanic(visualizer, getState))
	dr(attachSelectionMechanic(visualizer, getState))

	return trashbin.dispose
}

