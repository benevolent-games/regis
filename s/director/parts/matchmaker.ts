
export type Pair = [number, number]

export class Matchmaker {
	queue = new Set<number>()

	;*extractPairs() {
		let previous: number | null = null

		for (const current of this.queue) {
			if (previous !== null) {
				const pair = [previous, current] as [number, number]
				this.queue.delete(previous)
				this.queue.delete(current)
				previous = null
				yield pair
			}
			previous = current
		}
	}
}

