
import {ArbiterState, ChronicleRecord} from "../../state.js"
import {censorTeam, censorUnits} from "../aspects/censorship.js"
import {limitedVision, universalVision} from "../aspects/vision.js"

export function finalizeGameStates(state: ArbiterState, chronicle: ChronicleRecord[]) {
	return {
		arbiter: state,
		agents: state.teams.map((_, teamId) => {
			const vision = chronicle.length === 0
				? universalVision(state)
				: limitedVision(state, teamId)
			return {
				initial: state.initial,
				context: state.context,
				units: censorUnits(state.units, vision),
				teams: state.teams.map((team, id) => id === teamId ? team : censorTeam(team)),
				investments: state.investments,
				reminders: {
					choices: [],
					kills: [],
				},
			}
		}),
	}
}

