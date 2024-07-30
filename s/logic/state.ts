
import {loop2d, Vec2} from "@benev/toolbox"

/////////////////////////////////////////////////
/////////////////////////////////////////////////

export type GameHistory = {
	initial: GameInitial
	chronicle: Incident.Any[]
}

export type GameInitial = {
	teams: InitialTeamInfo[]
	board: BoardState
	units: Unit[]
	config: GameConfig
}

export type GameConfig = {
	startingResources: number
	universalBasicIncome: number
	unitArchetypes: UnitArchetypes
	costs: {
		investing: [number, number]
		staking: {
			resource: number
			watchtower: number
			tech: Record<keyof Claim.Tech, number>
		}
	}
}

export function defaultGameConfig(): GameConfig {
	return {
		startingResources: 8,
		universalBasicIncome: 2,
		unitArchetypes: defaultUnitArchetypes(),
		costs: {
			investing: [12, 18],
			staking: {
				resource: 4,
				watchtower: 0,
				tech: {
					knight: 4,
					rook: 6,
					bishop: 6,
					queen: 6,
				},
			},
		},
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
	winner: null | Incident.Conclusion
}

/** what happened in the previous turn (may be censored for fog-of-war) */
export type Reminders = {
	choices: Choice.Any[]
	kills: {
		unitKind: UnitKind
		place: Vec2
	}[]
}

export type ChoiceActuators = {[P in Choice.Any["kind"]]: (choice: any) => void}
export const choiceActuators = <X extends ChoiceActuators>(fns: X) => fns

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

export function isFullTeamInfo(team: FullTeamInfo | LimitedTeamInfo): team is FullTeamInfo {
	return "resources" in team
}

export type Roster = Record<UnitKind, number>

export function defaultRoster(): Roster {
	return {
		obstacle: 0,
		king: 1,
		queen: 1,
		bishop: 2,
		knight: 2,
		rook: 2,
		pawn: 8,
	}
}

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
		target: Vec2
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

export namespace Incident {
	export type Turn = {
		kind: "turn"
		choices: Choice.Any[]
	}

	export type Conclusion = {
		kind: "conclusion"
		winner: number
		reason: "time" | "conquest" | "surrender"
	}

	export type Any = Turn | Conclusion
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

export type UnitArchetype = {
	cost: null | number
	health: null | number
	royalty: boolean
	stakeholder: boolean
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

export type UnitArchetypes = Record<UnitKind, UnitArchetype>

export const defaultUnitArchetypes = (): UnitArchetypes => ({
	obstacle: {
		cost: null,
		health: 8,
		royalty: false,
		stakeholder: false,
		vision: null,
		move: null,
		attack: null,
	},

	king: {
		cost: null,
		health: 4,
		royalty: true,
		stakeholder: false,
		vision: {
			range: 2,
			verticality: verticality.downwards,
		},
		move: {
			range: 2,
			verticality: verticality.flat,
		},
		attack: null,
	},

	queen: {
		cost: 12,
		health: 3,
		royalty: true,
		stakeholder: false,
		vision: {
			range: 2,
			verticality: verticality.everywhere,
		},
		move: {
			range: 2,
			verticality: verticality.flat,
		},
		attack: null,
	},

	bishop: {
		cost: 12,
		health: 3,
		royalty: false,
		stakeholder: false,
		vision: {
			range: 2,
			verticality: verticality.downwards,
		},
		move: {
			range: 2,
			verticality: verticality.flat,
		},
		attack: {
			damage: 2,
			range: 2,
			verticality: verticality.everywhere,
		},
	},

	knight: {
		cost: 6,
		health: 3,
		royalty: false,
		stakeholder: false,
		vision: {
			range: 2,
			verticality: verticality.downwards,
		},
		move: {
			range: 3,
			verticality: verticality.flat,
		},
		attack: {
			damage: 1,
			range: 1,
			verticality: verticality.flat,
		},
	},

	rook: {
		cost: 10,
		health: 5,
		royalty: false,
		stakeholder: false,
		vision: {
			range: 1,
			verticality: verticality.downwards,
		},
		move: {
			range: 1,
			verticality: verticality.flat,
		},
		attack: {
			damage: 2,
			range: 1,
			verticality: verticality.everywhere,
		},
	},

	pawn: {
		cost: 4,
		health: 2,
		royalty: false,
		stakeholder: false,
		vision: {
			range: 1,
			verticality: verticality.downwards,
		},
		move: {
			range: 2,
			verticality: verticality.flat,
		},
		attack: {
			damage: 1,
			range: 1,
			verticality: verticality.flat,
		},
	},
})

