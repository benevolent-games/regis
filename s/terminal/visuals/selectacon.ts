
import {Vec2} from "@benev/toolbox"
import {pubsub} from "@benev/slate"

import {Ui, Selected} from "../ui.js"
import {World} from "./parts/world.js"
import {Assets} from "./parts/assets.js"
import {FnPickTilePlace} from "./types.js"
import {Trashbin} from "../../tools/trashbin.js"
import {Agent} from "../../logic2/helpers/agent.js"

export class Selectacon {
	#trashbin = new Trashbin()
	onSelectionChange = pubsub<[Selected | null]>()

	constructor(private options: {
		agent: Agent
		world: World
		assets: Assets
		ui: Ui
		pick: FnPickTilePlace
	}) {}

	get selection() {
		return this.options.ui.state.selection
	}

	set selection(selection: Selected | null) {
		this.options.ui.state.selection = selection
	}

	select(place: Vec2 | null) {
		const {agent} = this.options
		this.selection = place
			? {
				place,
				tile: agent.tiles.at(place),
				unit: agent.units.at(place),
			}
			: null
		this.render()
		this.onSelectionChange.publish(this.selection)
	}

	render() {
		this.#trashbin.dispose()
		const {agent, assets} = this.options
		if (this.selection) {
			const position = agent.coordinator.toPosition(this.selection.place)
			const instance = assets.indicators.selection()
			instance.position.set(...position)
			this.#trashbin.disposable(instance)
		}
	}

	dispose() {
		this.#trashbin.dispose()
	}
}

