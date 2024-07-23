
import {Assets} from "./parts/assets.js"
import {Agent} from "../../logic/agent.js"

export function makeUnitVisuals(agent: Agent, assets: Assets) {
	let wipe = () => {}

	function render() {
		wipe()
		for (const [,unit] of agent.units.list()) {
			const instancer = assets.units.unit.get(unit.kind)
			if (!instancer)
				throw new Error(`cannot spawn unknown unit kind "${unit.kind}"`)
			const instance = instancer(unit)
			instance.position.set(...agent.coordinator.toPosition(unit.place))
			wipe = () => instance.dispose()
		}
	}

	return {
		render,
		dispose() {
			wipe()
		},
	}
}

