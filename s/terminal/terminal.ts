
import {Agent} from "../logic/agent.js"
import {Tiler} from "./visuals/tiler.js"
import {Rosters} from "./visuals/rosters.js"
import {Trashbin} from "../tools/trashbin.js"
import {FnActuate} from "../logic/arbiter.js"
import {Hovering} from "./visuals/hovering.js"
import {Traversal} from "./visuals/traversal.js"
import {CameraRig} from "./visuals/camera-rig.js"
import {makeUnitVisuals} from "./visuals/unit.js"
import {Selectacon} from "./visuals/selectacon.js"
import {UserInputs} from "./visuals/user-inputs.js"
import {makeBasicVisuals} from "./visuals/basics.js"

export async function makeGameTerminal(agent: Agent, actuate: FnActuate) {
	const trashbin = new Trashbin()
	const d = trashbin.disposable
	const {dispose} = trashbin

	const {world, assets} = d(await makeBasicVisuals())
	d(assets.board.border())

	const tiler = d(new Tiler({agent, world, assets}))
	const rosters = d(new Rosters({agent, world, assets}))
	const selectacon = d(new Selectacon({agent, world, assets, tiler, rosters}))
	const units = d(makeUnitVisuals(agent, assets))
	const traversal = d(new Traversal({agent, assets, selectacon, actuate}))
	const cameraRig = d(new CameraRig({world}))

	d(new Hovering({world, selectacon}))
	d(new UserInputs({agent, world, selectacon, cameraRig}))

	function render() {
		tiler.render()
		rosters.render()
		selectacon.render()
		units.render()
		traversal.render()
	}

	render()
	world.gameloop.start()

	return {world, render, dispose}
}

