
import {Ui} from "./ui.js"
import {Agent} from "../logic/agent.js"
import {Rosters} from "./visuals/roster.js"
import {Trashbin} from "../tools/trashbin.js"
import {FnActuate} from "../logic/arbiter.js"
import {Traversal} from "./visuals/traversal.js"
import {makeTileVisuals} from "./visuals/tile.js"
import {makeUnitVisuals} from "./visuals/unit.js"
import {Selectacon} from "./visuals/selectacon.js"
import {makeHoverVisuals} from "./visuals/hover.js"
import {makeBasicVisuals} from "./visuals/basics.js"
import {makeCameraVisuals} from "./visuals/camera.js"
import {ClickHandler} from "./visuals/click-handler.js"

export async function makeGameTerminal(agent: Agent, actuate: FnActuate) {
	const trashbin = new Trashbin()
	const d = trashbin.disposable
	const {dispose} = trashbin

	const ui = new Ui()
	const {world, assets} = d(await makeBasicVisuals())

	d(assets.board.border())
	const tiles = d(makeTileVisuals(agent, world, assets))
	d(makeCameraVisuals(agent, world, tiles.pick))
	const units = d(makeUnitVisuals(agent, assets))
	const hover = d(makeHoverVisuals(agent, world, assets, ui, tiles.pick))
	const rosters = d(new Rosters({agent, world, assets}))

	const selectacon = d(new Selectacon({agent, world, assets, ui, pick: tiles.pick}))
	const traversal = d(new Traversal({agent, assets, selectacon, actuate}))

	d(new ClickHandler({
		world,
		pick: tiles.pick,
		onPlaceClick: place => {
			if (place && selectacon.selection?.unit)
				traversal.attemptMove(selectacon.selection.place, place)
			selectacon.select(place)
		},
	}))

	function render() {
		tiles.render()
		units.render()
		hover.render()
		selectacon.render()
		traversal.render()
		rosters.render()
	}

	render()
	world.gameloop.start()

	return {world, render, dispose}
}

