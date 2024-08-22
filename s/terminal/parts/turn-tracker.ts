
import {Agent} from "../../logic/agent.js"

export class TurnTracker {
	constructor(private options: {
		agent: Agent
		teamControl: number[]
	}) {}

	get ourTurn() {
		const {agent, teamControl} = this.options
		return teamControl.includes(agent.currentTurn)
	}

	canControlUnit(unitId: string) {
		const {agent, teamControl} = this.options
		if (this.ourTurn) {
			const unit = agent.units.get(unitId)
			if (unit && typeof unit.team === "number")
				return teamControl.includes(unit.team)
		}
		return false
	}
}

