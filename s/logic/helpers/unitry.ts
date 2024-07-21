
import {vec2, Vec2} from "@benev/toolbox"
import {mintId} from "../../tools/mint-id.js"
import {Unit, UnitEntry, Units} from "../state/units.js"

export function unitry(units: Units) {
	return new Unitry(units)
}

export class Unitry {
	constructor(public units: Units) {}

	has(id: string) {
		return this.units.some(([unitId]) => unitId === id)
	}

	get(id: string) {
		for (const [unitId, unit] of this.units)
			if (unitId === id)
				return unit
		throw new Error(`unit not found ${id}`)
	}

	at(place: Vec2) {
		for (const [id, unit] of this.units)
			if (vec2.equal(place, unit.place))
				return [id, unit] as UnitEntry
	}

	;*list(filter?: {team: null | number}) {
		for (const [id, unit] of this.units)
			if (filter ? unit.team === filter.team : true)
				yield [id, unit] as UnitEntry
	}

	add(unit: Unit) {
		const id = mintId()
		if (this.has(id))
			throw new Error(`unit already exists ${id}`)
		this.units.push([id, unit])
		return id
	}

	delete(id: string) {
		this.units = this.units.filter(([unitId]) => unitId !== id)
	}
}

