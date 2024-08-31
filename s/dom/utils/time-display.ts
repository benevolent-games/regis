
import {signal} from "@benev/slate"
import {TimeReport} from "../../logic/utilities/chess-timer.js"

export class TimeDisplay {
	ourTeam = signal(true)
	remaining = signal<number | null>(null)

	update(report: TimeReport, activeTeamIndex: number, ourTeamIndex: number) {
		const teamReport = report.teamwise.at(activeTeamIndex)!
		this.remaining.value = teamReport.remaining
		this.ourTeam.value = activeTeamIndex === ourTeamIndex
	}
}

