
import {loop2d, Vec2} from "@benev/toolbox"

import {UnitArchetypes} from "./data.js"
import {TimeRules} from "../tools/chess-timer/types.js"

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

export type GameConfig = {
	time: TimeRules | null
	startingResources: number
	universalBasicIncome: number
	resourceValue: number
	specialResourceValue: number
	unitArchetypes: UnitArchetypes
	teams: InitialTeamInfo[]
	costs: {
		staking: {
			resources: [number, number, number]
			specialResource: number
			watchtower: number
			tech: Record<TechKind, number>
		}
	}
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

export type InitialTeamInfo = {
	name: string
	roster: Roster
}

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

export type Roster = Record<UnitKind, number>

/////////////////////////////////////////////////
/////////////////////////////////////////////////

export type TechKind = (
	| "knight"
	| "rook"
	| "bishop"
	| "queen"
	| "elephant"
)

export namespace Claim {
	export type SpecialResource = {
		stockpile: number
	}
	export type Resource = {
		stockpile: number
		level: 1 | 2 | 3
	}
	export type Watchtower = {
		range: number
		verticality: Verticality
	}
	export type Tech = Record<TechKind, boolean>
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

	export type Any = (
		| Spawn
		| Movement
		| Attack
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
	claim: TileClaim
}

export type TileClaim = {
	resource: Claim.Resource | null
	specialResource: Claim.SpecialResource | null
	watchtower: Claim.Watchtower | null
	tech: Claim.Tech | null
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
		claim: {
			watchtower: null,
			resource: null,
			specialResource: null,
			tech: null,
		}
	}))
	return {extent, tiles}
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////

export type Unit = {
	id: number
	place: Vec2
	kind: UnitKind
	team: null | number
	damage: number
}

export type VerticalCapability = {
	above: boolean
	below: boolean
}

export const verticality = {
	flat: {above: false, below: false},
	downwards: {above: false, below: true},
	upwards: {above: true, below: false},
	everywhere: {above: true, below: true},
} satisfies Record<string, VerticalCapability>

export type Verticality = keyof typeof verticality

export function getVerticalCapability(v: Verticality) {
	return verticality[v]
}

export type UnitArchetype = {
	cost: null | number
	health: null | number
	stakeholder: boolean
	actionCap: number
	spawning: null | {
		verticality: Verticality
	}
	vision: null | {
		range: number
		verticality: Verticality
	}
	move: null | {
		cap: number
		range: number
		chebyshev: boolean
		verticality: Verticality
	}
	attack: null | {
		cap: number
		damage: number
		range: number
		verticality: Verticality
	}
}

export type UnitKind = (
	| "obstacle"
	| "king"
	| "queen"
	| "bishop"
	| "knight"
	| "rook"
	| "pawn"
	| "elephant"
)

