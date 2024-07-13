
// import {Stuff} from "../../../tools/stuff.js"
// import {Trashbin} from "../../../tools/trashbin.js"
// import {BlockInstancers, Board} from "../../board/board.js"
// import {parseAsciiMap} from "../../ascii/parse-ascii-map.js"
// import {Bishop, Grid, King, Knight, Pawn, Placements, Queen, Rook, Selectacon} from "../../concepts.js"
// import { World } from "../../world/world.js"
//
// export class Game {
// 	grid = new Grid()
// 	placements = new Placements()
// 	properSelectacon = new Selectacon(this.grid, this.placements)
// 	cameraSelectacon = new Selectacon(this.grid, this.placements)
//
// 	board: Board
// 	#trashbin = new Trashbin()
//
// 	constructor(
// 			public world: World,
// 			public stuff: Stuff,
// 			asciiMap: string,
// 		) {
//
// 		const {disposable: d} = this.#trashbin
// 		const {grid, placements, properSelectacon} = this
//
// 		const blockInstancers = (name: string): BlockInstancers => ({
// 			normal: () => d(stuff.instance(`${name}`)),
// 			vision: () => d(stuff.instance(`${name}-vision`)),
// 			hover: () => d(stuff.instance(`${name}-hover`)),
// 			selected: () => d(stuff.instance(`${name}-selected`)),
// 		})
//
// 		d(stuff.instance("border8x8"))
//
// 		this.board = d(new Board({
// 			world,
// 			grid,
// 			placements,
// 			properSelectacon,
// 			blocks: {
// 				size: 2,
// 				height: 1,
// 				instancers: {
// 					box: {
// 						levelOne: blockInstancers("block1"),
// 						levelTwo: blockInstancers("block2"),
// 						levelThree: blockInstancers("block3"),
// 					},
// 					ramp: {
// 						levelTwo: blockInstancers("ramp2"),
// 						levelThree: blockInstancers("ramp3"),
// 					},
// 				},
// 			},
// 			unitInstancers: (new Map()
// 				.set(King, () => stuff.instance("unit-king"))
// 				.set(Queen, () => stuff.instance("unit-queen"))
// 				.set(Bishop, () => stuff.instance("unit-bishop"))
// 				.set(Knight, () => stuff.instance("unit-knight"))
// 				.set(Rook, () => stuff.instance("unit-rook"))
// 				.set(Pawn, () => stuff.instance("unit-pawn"))
// 			),
// 		}))
//
// 		parseAsciiMap({
// 			grid,
// 			placements,
// 			ascii: asciiMap,
// 		})
//
// 		this.board.render()
// 	}
//
// 	dispose() {
// 		this.#trashbin.dispose()
// 	}
// }
//
