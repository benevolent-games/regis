
import {vec2, Vec2} from "@benev/toolbox"
import {mintId} from "../../tools/mint-id.js"
import {Unit, UnitEntry, UnitsState} from "../state/units.js"

export class UnitsHelper {
	constructor(public state: UnitsState) {}

	has(id: string) {
		return this.state.some(([unitId]) => unitId === id)
	}

	get(id: string) {
		for (const [unitId, unit] of this.state)
			if (unitId === id)
				return unit
		throw new Error(`unit not found ${id}`)
	}

	at(place: Vec2) {
		for (const [id, unit] of this.state)
			if (vec2.equal(place, unit.place))
				return [id, unit] as UnitEntry
	}

	;*list(filter?: {team: null | number}) {
		for (const [id, unit] of this.state)
			if (filter ? unit.team === filter.team : true)
				yield [id, unit] as UnitEntry
	}

	add(unit: Unit) {
		const id = mintId()
		if (this.has(id))
			throw new Error(`unit already exists ${id}`)
		this.state.push([id, unit])
		return id
	}

	delete(id: string) {
		this.state = this.state.filter(([unitId]) => unitId !== id)
	}
}

