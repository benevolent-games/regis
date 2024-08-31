
import {Agent} from "../../agent.js"

export class TurnTracker {
	constructor(
		public agent: Agent,
		public teamId: number,
	) {}

	get ourTurn() {
		return this.teamId === this.agent.activeTeamId
	}
}

