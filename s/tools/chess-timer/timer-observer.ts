
import {ChessTimer} from "./chess-timer.js"
import {TimeReport, TimeRules} from "./types.js"

export class TimerObserver {
	#lastUpdate = Date.now()

	constructor(
		public rules: TimeRules | null,
		public remoteReport: TimeReport,
	) {}

	update(report: TimeReport) {
		this.remoteReport = report
		this.#lastUpdate = Date.now()
	}

	report(activeTeamIndex: number): TimeReport {
		const {remoteReport} = this
		const since = Date.now() - this.#lastUpdate

		const gameTime = remoteReport.gameTime + since
		const teamwise = ChessTimer.generateTeamwise(
			this.rules,
			remoteReport.teamwise,
			activeTeamIndex,
			since,
		)

		return {gameTime, teamwise}
	}
}

