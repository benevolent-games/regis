
import {Agent} from "../agent.js"
import {purchase} from "./aspects/money.js"
import {propose} from "./aspects/propose.js"
import {AgentState, Choice, choiceActuators} from "../state.js"

export function applyTurn(state: AgentState, turn: {choices: Choice.Any[]}) {
	console.log("APPLY TURN", turn.choices)
	for (const choice of turn.choices)
		choices(state)[choice.kind](choice as any)
}

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

function choices(state: AgentState) {
	const agent = new Agent(state)
	const teamId = state.context.currentTurn

	return choiceActuators({
		spawn(choice: Choice.Spawn) {
			const possible = propose(agent).spawn(choice)
			if (possible) {
				purchase(state, teamId, possible.cost)
				agent.units.add({
					kind: choice.unitKind,
					place: choice.place,
					team: teamId,
					damage: 0,
				})
			}
			else throw new Error("invalid spawn")
		},

		movement(choice: Choice.Movement) {
			console.log("apply movement choice")
			const possible = propose(agent).movement(choice)
			if (possible) {
				console.log("moved", possible.unit.kind)
				possible.unit.place = choice.target
			}
			else throw new Error("invalid movement")
		},

		attack(choice: Choice.Attack) {},

		investment(choice: Choice.Investment) {},
	})
}

