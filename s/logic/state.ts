
import {loop2d, Vec2} from "@benev/toolbox"

import {UnitKind} from "../config/units.js"
import {GameConfig} from "../config/game/types.js"
import {BoardRange} from "../config/units/traits.js"

/////////////////////////////////////////////////
/////////////////////////////////////////////////

export type GameHistory = {
	initial: GameInitial
	chronicle: ChronicleRecord[]
}

///////////////////////////////////

export type ChronicleRecord = (
	| ChronicleTurn
	| ChronicleTimeExpired
	| ChronicleSurrender
)

export type ChronicleTurn = {
	kind: "turn"
	gameTime: number
	turn: Turn
}

export type ChronicleTimeExpired = {
	kind: "timeExpired"
	gameTime: number
	eliminatedTeamId: number
}

export type ChronicleSurrender = {
	kind: "surrender"
	gameTime: number
	eliminatedTeamId: number
}

///////////////////////////////////

export type GameInitial = {
	id: number
	board: BoardState
	units: Unit[]
	config: GameConfig
	mapMeta: MapMeta
}

export type MapMeta = {
	name: string
	author: string
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////

/** all possible perspectives on a game, the server is concerned with this */
export type GameStates = {
	arbiter: ArbiterState
	agents: AgentState[]
}

/** full uncensored view of of the game at one point in time */
export type ArbiterState = {
	initial: GameInitial
	units: Unit[]
	teams: FullTeamInfo[]
	context: GameContext
	reminders: Reminders
}

/** a potentially-censored view of the game (for fog-of-war) */
export type AgentState = {
	initial: GameInitial
	units: Unit[]
	teams: (FullTeamInfo | LimitedTeamInfo)[]
	context: GameContext
	reminders: Reminders
}

/** current situation that the game is in */
export type GameContext = {
	nextId: number
	turnCount: number
	conclusion: null | Conclusion
}

/** what happened in the previous turn (may be censored for fog-of-war) */
export type Reminders = {
	revelations: Vec2[]
}

export type ChoiceKind = Choice.Any["kind"]

/////////////////////////////////////////////////
/////////////////////////////////////////////////

export type LimitedTeamInfo = {
	name: string
}

export type FullTeamInfo = {
	name: string
	resources: number
}

export type TeamInfo = LimitedTeamInfo | FullTeamInfo

export function isFullTeamInfo(team: TeamInfo): team is FullTeamInfo {
	return "resources" in team
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////

export namespace Claim {
	export type SpecialResource = {
		kind: "specialResource"
		stockpile: number
	}
	export type Resource = {
		kind: "resource"
		level: 1 | 2 | 3
		stockpile: number
	}
	export type Watchtower = {
		kind: "watchtower"
		range: BoardRange
	}
	export type Tech = {
		kind: "tech"
		unlocks: string[]
	}
	export type Any = (
		| SpecialResource
		| Resource
		| Watchtower
		| Tech
	)
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////

export namespace Choice {
	export type Spawn = {
		kind: "spawn"
		unitKind: UnitKind
		place: Vec2
	}

	export type Movement = {
		kind: "movement"
		source: Vec2
		path: Vec2[]
	}

	export type Attack = {
		kind: "attack"
		attackerId: number
		victimId: number
	}

	export type Heal = {
		kind: "heal"
		doctorId: number
		patientId: number
	}

	export type Any = (
		| Spawn
		| Movement
		| Attack
		| Heal
	)
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////

export type Conclusion = {
	reason: "conquest" | "timeExpired" | "surrender"
	winnerTeamId: number
}

// TODO maybe replace the "turn" concept with just "choices"..
export type Turn = {
	choices: Choice.Any[]
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////

export type Elevation = 0 | 1 | 2 | 3

export type Tile = {
	elevation: Elevation
	step: boolean
	claims: Claim.Any[]
}

export type BoardState = {
	extent: Vec2
	tiles: Tile[]
}

export function makePlainBoardState(): BoardState {
	const extent: Vec2 = [8, 8]
	const tiles = [...loop2d(extent)].map((): Tile => ({
		step: false,
		elevation: 1,
		claims: [],
	}))
	return {extent, tiles}
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////

export type Unit = {
	id: number
	place: Vec2
	kind: UnitKind
	damage: number

	// TODO rename to "teamId"
	team: null | number
}

