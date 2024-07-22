
import {Viz} from "../viz.js"
import {Trashbin} from "../../../tools/trashbin.js"

export function makeUnitRenderer({agent, chessGlb}: Viz) {
	const trashbin = new Trashbin()

	function wipe() {
		trashbin.dispose()
	}

	function render() {
		wipe()
		for (const [,unit] of agent.units.list()) {
			const instancer = chessGlb.unit.get(unit.kind)
			if (!instancer)
				throw new Error(`cannot spawn unknown unit kind "${unit.kind}"`)
			const instance = instancer(unit)
			trashbin.disposable(instance)
			instance.position.set(...agent.coordinator.toPosition(unit.place))
		}
	}

	return {
		render,
		dispose: wipe,
	}
}

