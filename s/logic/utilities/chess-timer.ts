
import {loop} from "@benev/toolbox"

export type TimeRules = {
	limit: number
	delay: number
	charity: number
}

type TeamRecord = {

	/** actual elapsed amount of time */
	elapsed: number

	/** accumulation of delay and charity benefits */
	benefits: number
}

export type TimeReport = {
	gameTime: number
	teamwise: TeamTimeReport[]
}

export type TeamTimeReport = {

	/** actual elapsed amount of time */
	elapsed: number

	/** how long before expiration */
	remaining: number | null

	/** true if the player should lose on time */
	expired: boolean
}

export class ChessTimer {
	#team = 0
	#gameStart = Date.now()
	#turnStart = this.#gameStart
	#teams: TeamRecord[]

	constructor(public rules: TimeRules | null, teamCount: number) {
		this.#teams = [...loop(teamCount)].map(() => ({
			elapsed: 0,
			benefits: 0,
		}))
	}

	get gameTime() {
		return Date.now() - this.#gameStart
	}

	get team() {
		return this.#team
	}

	set team(team: number) {
		const nextTeam = team
		const previousTeam = this.#team
		const teamChanged = nextTeam !== previousTeam

		if (teamChanged) {
			const stale = this.#teams[previousTeam]
			const sinceTurnStart = Date.now() - this.#turnStart

			// update record
			const record = this.#updateRecord(stale, sinceTurnStart)
			this.#teams[previousTeam] = record

			// update local state for next turn
			this.#team = nextTeam
			this.#turnStart = Date.now()
		}
	}

	report(): TimeReport {
		const {gameTime, rules} = this
		const sinceTurnStart = Date.now() - this.#turnStart

		const teamwise = this.#teams
			.map((stale, teamIndex): TeamTimeReport => {

				const record = teamIndex === this.#team
					? this.#updateRecord(stale, sinceTurnStart)
					: stale

				const {elapsed, benefits} = record

				const remaining = (rules)
					? (rules.limit - elapsed) + benefits
					: null

				const expired = (remaining === null)
					? false
					: remaining < 0

				return {elapsed, remaining, expired}
			})

		return {gameTime, teamwise}
	}

	#updateRecord(stale: TeamRecord, sinceTurnStart: number) {
		const {rules} = this

		const elapsed = stale.elapsed + sinceTurnStart
		let benefits = stale.benefits

		if (rules) {

			// award charity benefit
			benefits += rules.charity

			// award delay benefit
			const delay = Math.min(sinceTurnStart, rules.delay)
			benefits += delay
		}

		return {elapsed, benefits}
	}
}

