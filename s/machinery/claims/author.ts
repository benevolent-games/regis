
import {ClaimsReader} from "./reader.js"
import {Claim, ClaimsState} from "./data.js"

export class ClaimsAuthor {
	#map = new Map<number, Claim.Any>()

	get state(): ClaimsState {
		return [...this.#map.entries()]
	}

	read = new ClaimsReader(() => this.state)
}

