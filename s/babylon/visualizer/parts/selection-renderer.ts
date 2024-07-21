
import {Vec2} from "@benev/toolbox"
import {ChessGlb} from "../../chess-glb.js"
import {Board} from "../../../logic/state/board.js"
import {coordinator} from "../../../logic/helpers/coordinator.js"

export function makeSelectionRenderer(chessGlb: ChessGlb) {
	let wipe = () => {}

	function select(board: Board, place: Vec2 | undefined) {
		wipe()
		if (place) {
			const position = coordinator(board).toPosition(place)
			const instance = chessGlb.indicatorSelection()
			instance.position.set(...position)
			wipe = () => instance.dispose()
		}
	}

	return {
		select,
		dispose: wipe,
	}
}

