
import {clone} from "@benev/slate"
import {scalar} from "@benev/toolbox"

import {Agent} from "../agent.js"
import {isMovementValid} from "./routines.js"
import {GameState, Incident} from "../state/game.js"
import {extractAgentState} from "./extract-agent-state.js"

export function commit(original: GameState, incident: Incident.Any): GameState {
	const state = clone(original)
	const agent = new Agent(extractAgentState(state, state.arbiter))

	if (incident.kind === "conclusion") {
		state.context.winner = incident.winner
	}
	else if (incident.kind === "action") {
		if (incident.name === "move") {
			const {unitId, to} = incident
			const unit = agent.units.get(unitId)
			const valid = isMovementValid(agent, unit.place, to)
			if (valid)
				unit.place = to
			else
				throw new Error(`invalid move`)
		}
		else if (incident.name === "attack") {
			throw new Error("TODO implement attack")
		}
		else if (incident.name === "yield") {
			const teamCount = state.initiation.teams.length
			state.context.currentTurn = scalar.wrap(teamCount + 1, 0, teamCount - 1)
		}
	}

	state.chronicle.push(incident)
	return clone(state)
}

