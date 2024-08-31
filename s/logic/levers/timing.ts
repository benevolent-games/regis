
import {Trashbin} from "@benev/slate"
import {Arbiter} from "../arbiter.js"

export type TimeReport = {
	gameTime: number
	teamwise: TeamTimeRecord[]
}

export type TeamTimeRecord = {
	elapsed: number
}

export class TimeKeeper {
	#trashbin = new Trashbin()
	#gameStart = Date.now()
	#turnStart = Date.now()
	#currentTeam: number
	#teamRecords: TeamTimeRecord[]

	constructor(private arbiter: Arbiter) {
		const {agent} = arbiter

		this.#currentTeam = agent.activeTeamIndex

		this.#teamRecords = agent.state.teams.map(() => ({
			elapsed: 0,
		}))

		this.#trashbin.disposer(
			arbiter.statesRef.on(() => this.#onStateChange())
		)
	}

	#onStateChange() {
		const {agent} = this.arbiter
		const previousTeam = this.#currentTeam
		const nextTeam = agent.activeTeamIndex
		const turnChanged = nextTeam !== previousTeam

		if (turnChanged) {

			// update previous team (whose turn ended)
			const sinceTurnStart = Date.now() - this.#turnStart
			const record = this.#teamRecords[previousTeam]
			record.elapsed += sinceTurnStart

			// update local state
			this.#currentTeam = nextTeam
			this.#turnStart = Date.now()
		}
	}

	get gameTime() {
		return Date.now() - this.#gameStart
	}

	report(): TimeReport {
		const {gameTime} = this
		const sinceTurnStart = Date.now() - this.#turnStart
		const teamwise = this.#teamRecords
			.map((record, teamIndex): TeamTimeRecord => ({
				elapsed: teamIndex === this.#currentTeam
					? record.elapsed + sinceTurnStart
					: record.elapsed,
			}))
		return {gameTime, teamwise}
	}

	dispose() {
		this.#trashbin.dispose()
	}
}

