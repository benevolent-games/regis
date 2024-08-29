
import {Agent} from "../../agent.js"

export class TurnTracker {
	constructor(
		public agent: Agent,
		public teamIndex: number,
	) {}

	get ourTurn() {
		return this.teamIndex === this.agent.activeTeamIndex
	}
}

