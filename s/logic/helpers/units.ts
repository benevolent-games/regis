
import {Unit} from "../state.js"
import {vec2, Vec2} from "@benev/toolbox"

export class UnitsHelper {
	constructor(public state: Unit[]) {}

	at(place: Vec2) {
		return this.state.find(unit => vec2.equal(unit.place, place))
	}

	require(place: Vec2) {
		const unit = this.at(place)
		if (!unit)
			throw new Error("required unit not found")
	}

	;*list(filter?: {team: null | number}) {
		for (const unit of this.state)
			if (filter ? unit.team === filter.team : true)
				yield unit
	}

	add(unit: Unit) {
		if (this.at(unit.place))
			throw new Error("cannot insert unit, place already occupied")
		this.state.push(unit)
	}

	delete(place: Vec2) {
		this.state = this.state.filter(unit => !vec2.equal(unit.place, place))
	}
}

