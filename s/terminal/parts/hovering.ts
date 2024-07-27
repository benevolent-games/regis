
import {ev} from "@benev/slate"
import {Pointing} from "./types.js"
import {World} from "./world.js"
import {Selectacon} from "./selectacon.js"
import {Trashbin} from "../../tools/trashbin.js"

export class Hovering {
	#last: Pointing | null = null
	#trashbin = new Trashbin()

	dispose = this.#trashbin.dispose

	constructor(options: {
			world: World
			selectacon: Selectacon
		}) {

		const {world, selectacon} = options
		const dr = this.#trashbin.disposer

		// record every pointer movement
		dr(ev(world.canvas, {
			pointermove: ({clientX, clientY}: PointerEvent) => {
				this.#last = {clientX, clientY}
			},
		}))

		// every tick, update the selectacon's hover
		dr(world.gameloop.on(() => {
			selectacon.performHover(this.#last)
		}))
	}
}

