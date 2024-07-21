
import {Vec2} from "@benev/toolbox"
import {ChessGlb} from "../../chess-glb.js"
import {Board} from "../../../logic/state/board.js"
import {coordinator} from "../../../logic/helpers/coordinator.js"

export function makeHoverRenderer(chessGlb: ChessGlb) {
	let wipe = () => {}

	function hover(board: Board, teamId: number, place: Vec2 | undefined) {
		wipe()
		if (place) {
			const position = coordinator(board).toPosition(place)
			const instance = chessGlb.indicatorHover(teamId)
			instance.position.set(...position)
			wipe = () => instance.dispose()
		}
	}

	return {
		hover,
		dispose: wipe,
	}

	// let lastPoint: undefined | {clientX: number, clientY: number}
	// let indicator: undefined | {
	// 	dispose: () => void
	// }
	//
	// function pointermove({clientX, clientY}: PointerEvent) {
	// 	lastPoint = {clientX, clientY}
	// }
	//
	// const cancelEvents = ev(world.canvas, {pointermove})
	//
	// const cancelLoop = world.gameloop.on(() => {
	// 	if (lastPoint) {
	// 		if (indicator)
	// 			indicator.dispose()
	// 		const place = tileRenderer.pick(lastPoint)
	// 		if (place) {
	// 			const {currentTurn} = getState().context
	// 			const instance = chessGlb.instance(`indicator-hover-team${currentTurn + 1}`)
	// 			const position = coordinator(getState().board).toPosition(place, true)
	// 			instance.position.set(...position)
	// 			indicator = {dispose: () => instance.dispose()}
	// 		}
	// 	}
	// })
	//
	// return {
	// 	dispose: () => {
	// 		cancelEvents()
	// 		cancelLoop()
	// 	},
	// }
}

