
import {Agent} from "../../agent.js"
import {Choice} from "../../state.js"
import {calculateMovement} from "./moving.js"
import {isValidSpawnPlace} from "./spawning.js"

export function propose(agent: Agent) {
	const teamId = agent.state.context.currentTurn
	return {

		spawn(choice: Choice.Spawn) {
			const {cost} = agent.state.initial.config.unitArchetypes[choice.unitKind]
			return cost !== null && isValidSpawnPlace(agent, teamId, choice.place)
				? {...choice, cost}
				: null
		},

		movement(choice: Choice.Movement) {
			const calculation = calculateMovement({
				agent,
				teamId,
				source: choice.source,
				target: choice.target,
			})
			return calculation
				? {...choice, ...calculation}
				: null
		},
	}
}

