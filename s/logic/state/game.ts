
import {Vec2} from "@benev/toolbox"

import {BoardState} from "./board.js"
import {UnitsState} from "./units.js"
import {ClaimsState} from "./claims.js"
import {TeamFoggy, Team} from "./teams.js"

export type GameState = GameReplay & GameTemporal

export type GameReplay = {
	initiation: GameDetails
	chronicle: Incident.Any[]
}

export type GameTemporal = {
	context: GameContext
	arbiter: GameDetails
	agents: GamePerspective[]
}

export type GameDetails = {
	teams: Team[]
	board: BoardState
	units: UnitsState
	claims: ClaimsState
}

export type GamePerspective = {
	teams: (Team | TeamFoggy)[]
	board: BoardState
	units: UnitsState
	claims: ClaimsState
}

/** game state that a client can render (may be partial for fog-of-war) */
export type AgentState = {context: GameContext} & GamePerspective

export type GameContext = {
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

