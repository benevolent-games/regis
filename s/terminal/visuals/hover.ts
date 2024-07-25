
import {ev} from "@benev/slate"

import {Ui} from "../ui.js"
import {World} from "./parts/world.js"
import {Assets} from "./parts/assets.js"
import {FnPickTilePlace} from "./types.js"
import {Agent} from "../../logic/helpers/agent.js"

export function makeHoverVisuals(
		agent: Agent,
		world: World,
		assets: Assets,
		ui: Ui,
		pick: FnPickTilePlace,
	) {

	let wipe = () => {}

	function render() {
		wipe()
		const {hover} = ui.state

		if (hover) {
			const {place} = hover
			const teamId = agent.state.context.currentTurn
			const position = agent.coordinator.toPosition(place)
			const instance = assets.indicators.hover(teamId)
			instance.position.set(...position)
			wipe = () => instance.dispose()
		}
	}

	let lastHoverPoint: undefined | {clientX: number, clientY: number}

	const stopListening = ev(world.canvas, {
		pointermove: ({clientX, clientY}: PointerEvent) => {
			lastHoverPoint = {clientX, clientY}
		},
	})

	const stopLooping = world.gameloop.on(() => {
		if (lastHoverPoint) {
			const place = pick(lastHoverPoint)
			ui.state.hover = place
				? {place}
				: null
			render()
		}
	})

	return {
		render,
		dispose() {
			wipe()
			stopListening()
			stopLooping()
		},
	}
}

