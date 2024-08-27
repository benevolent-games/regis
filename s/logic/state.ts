
import {UnitArchetypes} from "./data.js"
import {loop2d, Vec2} from "@benev/toolbox"

/////////////////////////////////////////////////
/////////////////////////////////////////////////

export type GameHistory = {
	initial: GameInitial
	chronicle: Turn[]
}

export type GameInitial = {
	board: BoardState
	units: Unit[]
	config: GameConfig
}

export type GameConfig = {
	startingResources: number
	universalBasicIncome: number
	unitArchetypes: UnitArchetypes
	teams: InitialTeamInfo[]
	costs: {
		resourceUpgrade: number
		staking: {
			resource: number
			watchtower: number
			tech: Record<keyof Claim.Tech, number>
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
	currentTurn: number
	conclusion: null | Conclusion
}

/** what happened in the previous turn (may be censored for fog-of-war) */
export type Reminders = {
	choices: Choice.Any[]
	kills: {
		unitKind: UnitKind
		place: Vec2
	}[]
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
	investments: Investment[]
}

export type FullTeamInfo = {
	name: string
	resources: number
	investments: Investment[]
}

export type TeamInfo = LimitedTeamInfo | FullTeamInfo

export function isFullTeamInfo(team: TeamInfo): team is FullTeamInfo {
	return "resources" in team
}

export type Roster = Record<UnitKind, number>

/////////////////////////////////////////////////
/////////////////////////////////////////////////

export type Investment = {
	place: Vec2
	count: number
}

export namespace Claim {
	export type Resource = {
		stockpile: number
		startsWithInvestments: number
	}
	export type Watchtower = {}
	export type Tech = {
		knight: boolean
		rook: boolean
		bishop: boolean
		queen: boolean
	}
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
		source: Vec2
		target: Vec2
	}

	export type Investment = {
		kind: "investment"
		place: Vec2
	}

	export type Any = (
		| Spawn
		| Movement
		| Attack
		| Investment
	)
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////

export type Conclusion = {
	kind: "conclusion"
	winner: number
	reason: "time" | "conquest" | "surrender"
}

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
	resource: null | Claim.Resource
	watchtower: null | Claim.Watchtower
	tech: null | Claim.Tech
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
			resource: null,
			watchtower: null,
			tech: null,
		}
	}))
	return {extent, tiles}
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////

export type Unit = {
	id: string
	place: Vec2
	kind: UnitKind
	team: null | number
	damage: number
}

export type VerticalCapability = {
	above: boolean
	below: boolean
}

export type UnitArchetype = {
	cost: null | number
	health: null | number
	stakeholder: boolean
	spawning: null | {
		verticality: VerticalCapability
	}
	vision: null | {
		range: number
		verticality: VerticalCapability
	}
	move: null | {
		range: number
		verticality: VerticalCapability
	}
	attack: null | {
		damage: number
		range: number
		verticality: VerticalCapability
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
)

