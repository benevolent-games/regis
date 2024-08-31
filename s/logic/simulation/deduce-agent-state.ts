
import {ArbiterState, GameHistory} from "../state.js"
import {censorTeam, censorUnits} from "./aspects/censorship.js"
import {limitedVision, universalVision} from "./aspects/vision.js"

export function deduceAgentState(
		history: GameHistory,
		state: ArbiterState,
		teamId: number,
	) {

	const {chronicle} = history

	const vision = chronicle.length === 0
		? universalVision(state)
		: limitedVision(state, teamId)

	return {
		initial: state.initial,
		context: state.context,
		units: censorUnits(state.units, vision),
		investments: state.investments,
		teams: state.teams.map(
			(team, id) => (id === teamId)
				? team
				: censorTeam(team)
		),
		reminders: {
			choices: [],
			kills: [],
		},
	}
}

