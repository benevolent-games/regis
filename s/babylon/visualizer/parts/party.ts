
import {deep} from "@benev/slate"
import {Vec2} from "@benev/toolbox"
import {Agent} from "../../../logic/agent.js"
import {Tile} from "../../../logic/state/board.js"
import {Unit} from "../../../logic/state/units.js"
import {wherefor} from "../../../tools/wherefor.js"

type HoverState = {
	place: Vec2
	teamId: number
}

type SelectionState = {
	place: Vec2
	tile: Tile
	unit: null | Unit
}

export type PartyState = {
	hover: null | HoverState
	selection: null | SelectionState
}

/** the local state of a user interface to play the game */
export class Party {
	state: PartyState = {
		hover: null,
		selection: null,
	}

	constructor(private options: {
		agent: Agent
		updateHover: () => void
		updateSelection: () => void
	}) {}

	#changeChecker(fn: () => any) {
		const previous = fn()
		return () => {
			const fresh = fn()
			return !deep.equal(previous, fresh)
		}
	}

	select(place: Vec2 | undefined) {
		const changed = this.#changeChecker(() => this.state.selection)
		this.state.selection = place
			? {
				place,
				tile: this.options.agent.board.at(place),
				unit: wherefor(this.options.agent.units.at(place), ([,unit]) => unit) ?? null,
			}
			: null
		if (changed())
			this.options.updateSelection()
	}

	hover(teamId: number, place: Vec2 | undefined) {
		const changed = this.#changeChecker(() => this.state.hover)
		this.state.hover = place
			? {teamId, place}
			: null
		if (changed())
			this.options.updateHover()
	}
}

