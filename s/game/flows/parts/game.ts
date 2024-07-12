
import {Stuff} from "../../../tools/stuff.js"
import {Trashbin} from "../../../tools/trashbin.js"
import {BlockInstancers, Board} from "../../board/board.js"
import {parseAsciiMap} from "../../ascii/parse-ascii-map.js"
import {Bishop, Grid, King, Knight, Pawn, Placements, Queen, Rook, Selectacon} from "../../concepts.js"
import { World } from "../../world/world.js"

export class Game {
	grid = new Grid()
	placements = new Placements()
	properSelectacon = new Selectacon(this.grid, this.placements)
	cameraSelectacon = new Selectacon(this.grid, this.placements)

	board: Board
	#trashbin = new Trashbin()

	constructor(
			public world: World,
			public stuff: Stuff,
			asciiMap: string,
		) {

		const {disposable: d} = this.#trashbin
		const {grid, placements, properSelectacon} = this

		const blockInstancers = (name: string): BlockInstancers => ({
			normal: () => d(stuff.instanceProp(`${name}`)),
			vision: () => d(stuff.instanceProp(`${name}-vision`)),
			hover: () => d(stuff.instanceProp(`${name}-hover`)),
			selected: () => d(stuff.instanceProp(`${name}-selected`)),
		})

		d(stuff.instanceProp("border8x8"))

		this.board = d(new Board({
			world,
			grid,
			placements,
			properSelectacon,
			blocks: {
				size: 2,
				height: 1,
				instancers: {
					box: {
						levelOne: blockInstancers("block1"),
						levelTwo: blockInstancers("block2"),
						levelThree: blockInstancers("block3"),
					},
					ramp: {
						levelTwo: blockInstancers("ramp2"),
						levelThree: blockInstancers("ramp3"),
					},
				},
			},
			unitInstancers: (new Map()
				.set(King, () => stuff.instanceProp("unit-king"))
				.set(Queen, () => stuff.instanceProp("unit-queen"))
				.set(Bishop, () => stuff.instanceProp("unit-bishop"))
				.set(Knight, () => stuff.instanceProp("unit-knight"))
				.set(Rook, () => stuff.instanceProp("unit-rook"))
				.set(Pawn, () => stuff.instanceProp("unit-pawn"))
			),
		}))

		parseAsciiMap({
			grid,
			placements,
			ascii: asciiMap,
		})

		this.board.render()
	}

	dispose() {
		this.#trashbin.dispose()
	}
}

