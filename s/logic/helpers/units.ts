
import {vec2, Vec2} from "@benev/toolbox"

import {Unit} from "../state.js"
import {boardCoords} from "../../tools/board-coords.js"

export class UnitsHelper {
	constructor(public state: Unit[]) {}

	get(id: number) {
		return this.state.find(unit => unit.id === id)
	}

	at(place: Vec2) {
		return this.state.find(unit => vec2.equal(unit.place, place))
	}

	requireGet(id: number) {
		const unit = this.get(id)
		if (!unit)
			throw new Error(`required unit not found, id ${id}`)
		return unit
	}

	requireAt(place: Vec2) {
		const unit = this.at(place)
		if (!unit)
			throw new Error(`required unit not found at ${boardCoords(place)}`)
		return unit
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
}

