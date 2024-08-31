
import {signal} from "@benev/slate"
import {TimeReport} from "../../logic/utilities/chess-timer.js"

export class TimeDisplay {
	ourTeam = signal(true)
	remaining = signal<number | null>(null)

	update(report: TimeReport, team: number) {
		const teamReport = report.teamwise.at(team)!
		this.remaining.value = teamReport.remaining
		this.ourTeam.value = true
	}
}

