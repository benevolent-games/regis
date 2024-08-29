
import {Agent} from "../../agent.js"

export class TurnTracker {
	constructor(
		private agent: Agent,
		private teamControl: number[],
	) {}

	get ourTurn() {
		return this.teamControl.includes(
			this.agent.activeTeamIndex
		)
	}

	canControlTeam(teamIndex: number) {
		return this.teamControl.includes(teamIndex)
	}

	canControlUnit(unitId: string) {
		if (this.ourTurn) {
			const unit = this.agent.units.get(unitId)
			if (unit && typeof unit.team === "number")
				return this.teamControl.includes(unit.team)
		}
		return false
	}
}

