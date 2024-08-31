
export class GamesStats {
	#times: number[] = []

	countNewGame() {
		this.#times.push(Date.now())
	}

	get gamesInLastHour() {
		const now = Date.now()
		const oneHour = 1000 * 60 * 60
		const threshold = now - oneHour
		this.#times = this.#times
			.filter(time => time > threshold)
		return this.#times.length
	}
}

