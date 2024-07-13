
import {vec2, Vec2} from "@benev/toolbox"
import {UnitsState} from "./data.js"

export class Units {
	constructor(public state: UnitsState) {}

	get map() {
		return new Map(this.state.entries)
	}

	get(id: number) {
		const unit = this.map.get(id)
		if (!unit) throw new Error(`unknown unit ${id}`)
		return unit
	}

	at(place: Vec2) {
		for (const [id, unit] of this.map)
			if (vec2.equal(place, unit.place))
				return {id, unit}
	}

	;*list(filter?: {team: null | number}) {
		for (const [id, unit] of this.map)
			if (filter && unit.team === filter.team)
				yield {id, unit}
	}
}

