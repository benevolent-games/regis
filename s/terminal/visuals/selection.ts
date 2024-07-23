
import {ev} from "@benev/slate"

import {Ui} from "../ui.js"
import {World} from "./parts/world.js"
import {Assets} from "./parts/assets.js"
import {Agent} from "../../logic/agent.js"
import {FnPickTilePlace} from "./types.js"

export function makeSelectionVisuals(
		agent: Agent,
		world: World,
		assets: Assets,
		ui: Ui,
		pick: FnPickTilePlace,
	) {

	let wipe = () => {}

	function render() {
		wipe()
		const {selection} = ui.state

		if (selection) {
			const position = agent.coordinator.toPosition(selection.place)
			const instance = assets.indicators.selection()
			instance.position.set(...position)
			wipe = () => instance.dispose()
		}
	}

	const stopListening = ev(world.canvas, {
		pointerdown: (event: PointerEvent) => {
			if (event.button !== 0)
				return

			const place = pick(event)

			ui.state.selection = place
				? {
					place,
					tile: agent.board.at(place),
					unit: agent.units.at(place),
				}
				: null

			render()
		},
	})

	return {
		render,
		dispose() {
			wipe()
			stopListening()
		},
	}
}

