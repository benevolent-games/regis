
import {deep} from "@benev/slate"
import {Vec2} from "@benev/toolbox"
import {Agent} from "../../../logic/agent.js"
import {Tile} from "../../../logic/state/board.js"
import {Unit} from "../../../logic/state/units.js"
import {wherefor} from "../../../tools/wherefor.js"

export type PartyState = {
	hover: null | Vec2
	selection: null | {
		place: Vec2
		tile: Tile
		unit: null | Unit
	}
}

/** the local state of a user interface to play the game */
export class Party {
	state: PartyState = {
		hover: null,
		selection: null,
	}

	constructor(public agent: Agent, public update: () => void) {}

	#updater(fn: () => any) {
		const previous = fn()
		return () => {
			const fresh = fn()
			if (deep.equal(previous, fresh))
				this.update()
		}
	}

	select(place: null | Vec2) {
		const update = this.#updater(() => this.state.selection)
		this.state.selection = place
			? {
				place,
				tile: this.agent.board.at(place),
				unit: wherefor(this.agent.units.at(place), ([,unit]) => unit) ?? null,
			}
			: null
		update()
	}

	hover(place: null | Vec2) {
		const update = this.#updater(() => this.state.hover)
		this.state.hover = place
		update()
	}
}

