
import {Couple, Person} from "../types.js"

export class Matchmaker {
	queue = new Set<Person>()

	;*extractCouples() {
		let previous: Person | null = null

		for (const current of this.queue) {
			if (previous !== null) {
				const pair = [previous, current] as Couple
				this.queue.delete(previous)
				this.queue.delete(current)
				previous = null
				yield pair
			}
			previous = current
		}
	}
}

