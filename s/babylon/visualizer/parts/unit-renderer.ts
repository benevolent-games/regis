
import {ChessGlb} from "../../chess-glb.js"
import {Board} from "../../../logic/state/board.js"
import {Units} from "../../../logic/state/units.js"
import {Trashbin} from "../../../tools/trashbin.js"
import {unitry} from "../../../logic/helpers/unitry.js"
import {coordinator} from "../../../logic/helpers/coordinator.js"

export function makeUnitRenderer(chessGlb: ChessGlb) {
	const trashbin = new Trashbin()

	function wipe() {
		trashbin.dispose()
	}

	function render(board: Board, units: Units) {
		wipe()
		console.log("render units", units)
		for (const [,unit] of unitry(units).list()) {
			console.log(unit)
			const instancer = chessGlb.unit.get(unit.kind)
			if (!instancer)
				throw new Error(`cannot spawn unknown unit kind "${unit.kind}"`)
			const instance = instancer(unit)
			trashbin.disposable(instance)
			instance.position.set(...coordinator(board).toPosition(unit.place, true))
		}
	}

	return {
		render,
		dispose: wipe,
	}
}

