
import {id_counter} from "@benev/toolbox"
import {Unit} from "./data.js"
import {Units} from "./units.js"

export class UnitsAuthor extends Units {
	#id = id_counter()

	constructor() {
		super({entries: []})
	}

	add(unit: Unit) {
		const id = this.#id()
		if (this.map.has(id)) throw new Error(`unit already exists ${id}`)
		this.map.set(id, unit)
		return id
	}

	delete(id: number) {
		this.map.delete(id)
	}
}

