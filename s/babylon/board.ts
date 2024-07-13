//
// import {Vec2} from "@benev/toolbox"
//
// import {ChessGlb} from "./chess-glb.js"
// import {Boundaries} from "../machinery/boundaries.js"
// import {Coordinator} from "../machinery/coordinator.js"
// import {Selectacon} from "../machinery/selectacon.js"
//
// type Options = {
// 	grid: Grid
// 	chessGlb: ChessGlb
// 	selectionSelectacon: Selectacon
// }
//
// type Stack = {
// 	tile: Tile
// 	place: Vec2
// 	dispose: () => void
// }
//
// export class Board {
// 	boundaries: Boundaries
// 	coordinator: Coordinator
// 	#stacks = new Map<Tile, Stack>()
//
// 	constructor(private options: Options) {
// 		const {grid} = options
//
// 		this.coordinator = new Coordinator({
// 			grid,
// 			blockSize: 2,
// 			blockHeight: 1,
// 		})
//
// 		this.boundaries = new Boundaries(grid, this.coordinator)
// 	}
//
// 	#spawnTile() {}
//
// 	render() {}
// }
//
