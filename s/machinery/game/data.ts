
import {Vec2} from "@benev/toolbox"
import {BoardState} from "../board/data.js"
import {UnitsState} from "../units/data.js"
import {TeamFoggy, TeamState} from "../teams/data.js"

/** starting state of the game */
export type Initiation = {
	board: BoardState
	units: UnitsState
	teams: TeamState[]
}

/** game state that a client can render (may be partial for fog-of-war) */
export type AgentState = {
	board: BoardState // agents can see the whole board's layout, in terms of terrain
	units: UnitsState // this is a partial account of the units that this agent has vision of
	teams: (TeamState | TeamFoggy)[] // team info may be censored for fog-of-war
	situation: Situation
}

export type Situation = {
	currentTurn: number
	winner: number | null
}

/** everything that can happen throughout the course of a game */
export namespace Incident {
	export namespace Action {
		export type Move = {
			kind: "action"
			name: "move"
			unitId: number
			to: Vec2
		}

		export type Attack = {
			kind: "action"
			name: "attack"
			unitId: number
			to: Vec2
		}

		export type Yield = {
			kind: "action"
			name: "yield"
		}

		export type Any = Move | Attack | Yield
	}

	export type Conclusion = {
		kind: "conclusion"
		winner: number
	}

	export type Any = (
		| Action.Any
		| Conclusion
	)
}

export type ActionActuators = Record<Incident.Action.Any["name"], (a: any) => void>
export const actionActuators = <A extends ActionActuators>(a: A) => a

