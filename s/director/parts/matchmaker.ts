
export type Pair = [number, number]

export class Matchmaker {
	queue = new Set<number>()

	;*extractPairs() {
		let previous: number | null = null
		for (const client of this.queue) {
			if (previous) {
				const pair = [previous, client] as [number, number]
				this.queue.delete(previous)
				this.queue.delete(client)
				previous = null
				yield pair
			}
		}
	}
}

