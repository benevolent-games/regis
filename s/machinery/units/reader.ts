
import {vec2, Vec2} from "@benev/toolbox"

import {UnitsState} from "./data.js"
import {Getter} from "../../tools/stately.js"

export class UnitsReader {
	#state: Getter<UnitsState>

	constructor(state: Getter<UnitsState>) {
		this.#state = state
	}

	get #map() {
		return new Map(this.#state())
	}

	get(id: number) {
		const unit = this.#map.get(id)
		if (!unit) throw new Error(`unknown unit ${id}`)
		return unit
	}

	at(place: Vec2) {
		for (const [id, unit] of this.#state())
			if (vec2.equal(place, unit.place))
				return {id, unit}
	}

	;*list(filter?: {team: null | number}) {
		for (const [id, unit] of this.#state())
			if (filter && unit.team === filter.team)
				yield {id, unit}
	}
}

