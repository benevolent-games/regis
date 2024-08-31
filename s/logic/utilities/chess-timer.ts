
import {loop} from "@benev/toolbox"

export type TimeRules = {
	limit: number
	delay: number
	charity: number
}

export type TimeRecord = {

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

	/** how long before expiration */
	remaining: number | null

	/** true if the player should lose on time */
	expired: boolean

} & TimeRecord

export class ChessTimer {
	#team = 0
	#gameStart = Date.now()
	#turnStart = this.#gameStart
	#teams: TimeRecord[]

	constructor(public rules: TimeRules | null, teamCount: number) {
		this.#teams = [...loop(teamCount)].map(() => ({
			elapsed: 0,
			benefits: 0,
		}))
	}

	static updateRecord(
			rules: TimeRules | null,
			stale: TimeRecord,
			sinceTurnStart: number,
		) {

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

	static calculateTeamReport(
			rules: TimeRules | null,
			record: TimeRecord,
		): TeamTimeReport {

		const {elapsed, benefits} = record

		const remaining = (rules)
			? (rules.limit - elapsed) + benefits
			: null

		const expired = (remaining === null)
			? false
			: remaining < 0

		return {elapsed, benefits, remaining, expired}
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
			const {rules} = this
			const stale = this.#teams[previousTeam]
			const sinceTurnStart = Date.now() - this.#turnStart

			// update record
			const record = ChessTimer.updateRecord(rules, stale, sinceTurnStart)
			this.#teams[previousTeam] = record

			// update local state for next turn
			this.#team = nextTeam
			this.#turnStart = Date.now()
		}
	}

	static generateTeamwise(
			rules: TimeRules | null,
			teamRecords: TimeRecord[],
			currentTeam: number,
			since: number,
		) {
		return teamRecords
			.map((stale, teamIndex): TeamTimeReport => {
				const record = teamIndex === currentTeam
					? ChessTimer.updateRecord(rules, stale, since)
					: stale
				return ChessTimer.calculateTeamReport(rules, record)
			})
	}

	report(): TimeReport {
		const {gameTime, rules} = this
		const sinceTurnStart = Date.now() - this.#turnStart

		const teamwise = ChessTimer.generateTeamwise(
			rules,
			this.#teams,
			this.#team,
			sinceTurnStart,
		)

		return {gameTime, teamwise}
	}
}

