
import {Assets} from "./parts/assets.js"
import {Agent} from "../../logic/agent.js"
import {Trashbin} from "../../tools/trashbin.js"

export function makeUnitVisuals(agent: Agent, assets: Assets) {
	const trashbin = new Trashbin()

	function render() {
		trashbin.dispose()
		for (const [,unit] of agent.units.list()) {
			const instancer = assets.units.unit.get(unit.kind)
			if (!instancer)
				throw new Error(`cannot spawn unknown unit kind "${unit.kind}"`)
			const instance = trashbin.disposable(instancer(unit))
			instance.position.set(...agent.coordinator.toPosition(unit.place))
		}
	}

	return {
		render,
		dispose() {
			trashbin.dispose()
		},
	}
}

