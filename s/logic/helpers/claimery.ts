
import {vec2, Vec2} from "@benev/toolbox"
import {unitry} from "./unitry.js"
import {Units} from "../state/units.js"
import {mintId} from "../../tools/mint-id.js"
import {Claim, Claims} from "../state/claims.js"

export function claimery(claims: Claims) {
	return new Claimery(claims)
}

export class Claimery {
	constructor(public claims: Claims) {}

	get(id: string) {
		for (const [claimId, claim] of this.claims)
			if (claimId === id)
				return claim
		throw new Error(`claim ${id} not found`)
	}

	at(place: Vec2) {
		return this.claims.filter(([,claim]) => vec2.equal(claim.place, place))
	}

	getStakeholder(id: string, units: Units) {
		const claim = this.get(id)
		return unitry(units).at(claim.place)
	}

	create(claim: Claim.Any) {
		const id = mintId()
		this.claims.push([id, claim])
		return id
	}
}

