
import {Agent} from "../agent.js"
import {purchase} from "./aspects/money.js"
import {propose} from "./aspects/propose.js"
import {AgentState, Choice, choiceActuators, UnitKind} from "../state.js"

export function simulateTurn(state: AgentState, turn: {choices: Choice.Any[]}) {
	const limits = new TurnLimits(state)
	for (const choice of turn.choices)
		choices(state, limits)[choice.kind](choice as any)
}

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

type UnitLimits = {
	moved: boolean
	attacked: boolean
}

class TurnLimits {
	units: Map<UnitKind, UnitLimits>

	constructor(state: AgentState) {
		this.units = new Map(Object
			.entries(state.initial.config.unitArchetypes)
			.map(([unitKind]) => [unitKind as UnitKind, {
				moved: false,
				attacked: false,
			}])
		)
	}
}

function choices(state: AgentState, limits: TurnLimits) {
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
			const possible = propose(agent).movement(choice)
			if (possible) {
				possible.unit.place = choice.target
			}
			else throw new Error("invalid movement")
		},

		attack(choice: Choice.Attack) {},

		investment(choice: Choice.Investment) {},
	})
}

