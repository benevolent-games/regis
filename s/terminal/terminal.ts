
import {Agent} from "../logic/agent.js"
import {Tiler} from "./visuals/tiler.js"
import {Rosters} from "./visuals/rosters.js"
import {Trashbin} from "../tools/trashbin.js"
import {FnActuate} from "../logic/arbiter.js"
import {Traversal} from "./visuals/traversal.js"
import {makeUnitVisuals} from "./visuals/unit.js"
import {makeBasicVisuals} from "./visuals/basics.js"
import {makeCameraVisuals} from "./visuals/camera.js"
import { Selectacon } from "./visuals/selectacon.js"

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

	d(makeCameraVisuals(agent, world, selectacon))

	d(new ClickHandler({
		world,
		onMousePrimary: cell => {
			selectacon.select(cell)
			// TODO logic for attempting moves, attacks, spawns, etc
		},
		onMouseSecondary: cell => {
			camera.pivot(cell.position)
		},
		onMouseTertiary: cell => {},

		onPlaceClick: place => {
			if (place && selectacon.selection?.unit)
				traversal.attemptMove(selectacon.selection.place, place)
			selectacon.select(place)
		},
	}))

	function render() {
		tiler.render()
		rosters.render()
		units.render()
		selectacon.render()
		traversal.render()
	}

	render()
	world.gameloop.start()

	return {world, render, dispose}
}

