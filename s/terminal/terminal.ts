
import {Ui} from "./ui.js"
import {Agent} from "../logic/agent.js"
import {Trashbin} from "../tools/trashbin.js"
import {makeTileVisuals} from "./visuals/tile.js"
import {makeUnitVisuals} from "./visuals/unit.js"
import {makeHoverVisuals} from "./visuals/hover.js"
import {makeBasicVisuals} from "./visuals/basics.js"
import {makeCameraVisuals} from "./visuals/camera.js"
import {makeSelectionVisuals} from "./visuals/selection.js"

export async function makeGameTerminal(agent: Agent) {
	const trashbin = new Trashbin()
	const d = trashbin.disposable
	const {dispose} = trashbin

	const ui = new Ui()
	const {world, assets} = d(await makeBasicVisuals())

	const tiles = d(makeTileVisuals(agent, world, assets))
	d(makeCameraVisuals(agent, world, tiles.pick))
	const units = d(makeUnitVisuals(agent, assets))
	const selection = d(makeSelectionVisuals(agent, world, assets, ui, tiles.pick))
	const hover = d(makeHoverVisuals(agent, world, assets, ui, tiles.pick))

	function render() {
		tiles.render()
		units.render()
		selection.render()
		hover.render()
	}

	render()
	world.gameloop.start()

	return {world, render, dispose}
}

