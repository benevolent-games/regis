
import {mapGuarantee} from "@benev/slate"

export class UnitFreedom {
	#map = new Map<string, {freedom: boolean}>()

	#obtain(id: string) {
		return mapGuarantee(this.#map, id, () => ({freedom: true}))
	}

	hasFreedom(id: string) {
		return this.#obtain(id).freedom
	}

	revokeFreedom(id: string) {
		this.#obtain(id).freedom = false
	}
}

