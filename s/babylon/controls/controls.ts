
import {Agent} from "../../logic/agent.js"
import {Trashbin} from "../../tools/trashbin.js"
import {Visualizer} from "../visualizer/visualizer.js"
import {attachHoverMechanic} from "./mechanics/hover.js"
import {attachCameraMechanic} from "./mechanics/camera.js"
import {attachSelectionMechanic} from "./mechanics/selection.js"

export function makeControls({agent, playAsTeams, visualizer}: {
		agent: Agent
		playAsTeams: number[]
		visualizer: Visualizer
	}) {

	const trashbin = new Trashbin()
	const dr = trashbin.disposer

	dr(attachCameraMechanic(visualizer, agent))
	dr(attachHoverMechanic(visualizer, agent))
	dr(attachSelectionMechanic(visualizer))

	return trashbin.dispose
}

