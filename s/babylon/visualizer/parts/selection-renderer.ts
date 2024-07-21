
import {Vec2} from "@benev/toolbox"
import {ChessGlb} from "../../chess-glb.js"
import {BoardState} from "../../../logic/state/board.js"
import {coordinator} from "../../../logic/helpers/coordinator.js"
import { Trashbin } from "../../../tools/trashbin.js"

export function makeSelectionRenderer(chessGlb: ChessGlb) {
	const trashbin = new Trashbin()

	function select(board: BoardState, place: Vec2 | undefined) {
		trashbin.dispose()
		if (place) {
			const position = coordinator(board).toPosition(place)
			const instance = chessGlb.indicatorSelection()
			instance.position.set(...position)
			trashbin.disposable(instance)
		}
	}

	return {
		select,
		dispose: trashbin.dispose,
	}
}

