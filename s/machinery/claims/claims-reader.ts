
import {vec2, Vec2} from "@benev/toolbox"
import {ClaimsState} from "./data.js"
import {UnitsReader} from "../units/units.js"

export class ClaimsReader {
	#getState: () => ClaimsState
	get #state() { return this.#getState() }

	constructor(getState: () => ClaimsState) {
		this.#getState = getState
	}

	get(id: number) {
		for (const [claimId, claim] of this.#state)
			if (claimId === id)
				return claim
		throw new Error(`claim ${id} not found`)
	}

	at(place: Vec2) {
		return this.#state.filter(([,claim]) => vec2.equal(claim.place, place))
	}

	getStakeholder(id: number, units: UnitsReader) {
		const claim = this.get(id)
		return units.at(claim.place)
	}
}

