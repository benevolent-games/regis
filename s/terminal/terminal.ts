
import {Trashbin} from "@benev/slate"

import {Tiler} from "./parts/tiler.js"
import {Agent} from "../logic/agent.js"
import {Rosters} from "./parts/rosters.js"
import {Planner} from "./parts/planner.js"
import {Hovering} from "./parts/hovering.js"
import {CameraRig} from "./parts/camera-rig.js"
import {makeUnitVisuals} from "./parts/unit.js"
import {Selectacon} from "./parts/selectacon.js"
import {SubmitTurnFn} from "../logic/arbiter.js"
import {UserInputs} from "./parts/user-inputs.js"
import {makeBasicVisuals} from "./parts/basics.js"
import {setupPreviewAgent} from "./parts/preview-agent.js"

export async function makeGameTerminal(

		// actual state from the arbiter
		baseAgent: Agent,

		// submit the player's turn to the arbiter
		submitTurn: SubmitTurnFn,
	) {

	const trashbin = new Trashbin()
	const d = trashbin.disposable
	const dr = trashbin.disposer
	const {dispose} = trashbin

	const {agent, reset: resetPreview} = d(
		setupPreviewAgent(baseAgent, () => planner.reset())
	)

	const {world, assets} = d(await makeBasicVisuals())
	d(assets.board.border())
	const cameraRig = d(new CameraRig({world}))
	const tiler = d(new Tiler({agent, world, assets}))
	const rosters = d(new Rosters({agent, world, assets}))
	const selectacon = d(new Selectacon({agent, world, assets, tiler, rosters}))
	const units = d(makeUnitVisuals(agent, assets))
	const planner = d(new Planner({agent, assets, selectacon, submitTurn}))
	d(new Hovering({world, selectacon}))
	d(new UserInputs({agent, world, planner, selectacon, cameraRig, resetPreview}))

	function render() {
		rosters.render()
		selectacon.render()
		units.render()
		planner.render()
	}

	tiler.render()
	render()
	world.gameloop.start()
	dr(agent.stateRef.on(render))

	return {world, render, dispose}
}

