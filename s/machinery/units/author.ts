
import {id_counter} from "@benev/toolbox"

import {Unit} from "./data.js"
import {Units} from "./units.js"

export class UnitsAuthor {
	#id = id_counter()
	#map = new Map<number, Unit>()

	get state() {
		return [...this.#map.entries()]
	}

	read = new Units(() => this.state)

	add(unit: Unit) {
		const id = this.#id()
		if (this.#map.has(id)) throw new Error(`unit already exists ${id}`)
		this.#map.set(id, unit)
		return id
	}

	delete(id: number) {
		this.#map.delete(id)
	}
}

