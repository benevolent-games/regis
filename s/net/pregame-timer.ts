
export type PregameTimeReport = {
	pregameTimeRemaining: number
}

export class PregameTimer {
	start = Date.now()

	constructor(public delay: number) {}

	get elapsed() {
		return Date.now() - this.start
	}

	report() {
		return {
			pregameTimeRemaining: Math.max(0, this.delay - this.elapsed),
		}
	}
}

