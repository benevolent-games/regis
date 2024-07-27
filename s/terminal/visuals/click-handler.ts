//
// import {ev} from "@benev/slate"
// import {Vec2} from "@benev/toolbox"
//
// import {World} from "./parts/world.js"
// import {DragQueen} from "../../tools/drag-queen.js"
//
// export class ClickHandler {
// 	#stop: () => void
//
// 	rightMouseDrags = new DragQueen({
// 		predicate: event => event.button === 2,
// 		onAnyDrag: () => {},
// 		onAnyClick: () => {},
// 		onIntendedDrag: (event, activity) => {
// 		},
// 		onIntendedClick: event => {
// 			const cell = selectacon.pick(event)
// 			if (cell)
// 				setCameraPivot(cell.position)
// 		},
// 	})
//
// 	constructor(private options: {
// 			world: World
// 			onPlaceClick: (place: Vec2 | null) => void
// 		}) {
// 		this.#stop = ev(options.world.canvas, this.#events)
// 	}
//
// 	#events = {
// 		pointerdown: (event: PointerEvent) => {
// 			if (event.button !== 0)
// 				return
// 			const {pick, onPlaceClick} = this.options
// 			onPlaceClick(pick(event) ?? null)
// 		},
// 	}
//
// 	dispose() {
// 		this.#stop()
// 	}
// }
//
