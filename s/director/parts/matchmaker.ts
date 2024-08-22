
import {ClientId} from "../types.js"

export type Pair = [ClientId, ClientId]

export class Matchmaker {
	queue = new Set<ClientId>()

	;*extractPairs() {
		let previous: ClientId | null = null

		for (const current of this.queue) {
			if (previous !== null) {
				const pair = [previous, current] as Pair
				this.queue.delete(previous)
				this.queue.delete(current)
				previous = null
				yield pair
			}
			previous = current
		}
	}
}

