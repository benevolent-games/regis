
import {seconds} from "../tools/timely.js"
import {GameConfig, InitialTeamInfo, Roster, UnitArchetype, UnitKind} from "./state.js"

export function defaultGameConfig(): GameConfig {
	const unitArchetypes = defaultUnitArchetypes()
	return {
		time: {
			limit: seconds(120),
			delay: seconds(5),
			charity: seconds(0),
		},
		startingResources: 8,
		universalBasicIncome: 1,
		teams: defaultTeams(),
		costs: {
			investment: 0,
			staking: {
				resource: 4,
				watchtower: 0,
				tech: {
					knight: 2,
					rook: 2,
					bishop: 4,
					queen: 0,
				},
			},
		},
		unitArchetypes,
	}
}

export function defaultTeams(): InitialTeamInfo[] {
	return [
		{name: "White", roster: defaultRoster()},
		{name: "Black", roster: defaultRoster()},
	]
}

export function defaultRoster(): Roster {
	return {
		obstacle: 0,
		king: 1,
		queen: 99,
		bishop: 99,
		knight: 99,
		rook: 99,
		pawn: 99,
	}
}

export type UnitArchetypes = Record<UnitKind, UnitArchetype>

export const defaultUnitArchetypes = (): UnitArchetypes => ({
	obstacle: {
		cost: null,
		health: 12,
		actionCap: 0,
		stakeholder: false,
		spawning: null,
		vision: null,
		move: null,
		attack: null,
	},

	king: {
		cost: null,
		health: 5,
		actionCap: 2,
		stakeholder: false,
		spawning: {
			verticality: "flat",
		},
		vision: {
			range: 2,
			verticality: "downwards",
		},
		move: {
			cap: 1,
			range: 1,
			chebyshev: true,
			verticality: "flat",
		},
		attack: {
			cap: 1,
			damage: 1,
			range: 1,
			verticality: "flat",
		},
	},

	pawn: {
		cost: 4,
		health: 3,
		actionCap: 2,
		stakeholder: true,
		spawning: null,
		vision: {
			range: 2,
			verticality: "downwards",
		},
		move: {
			cap: 1,
			range: 2,
			chebyshev: false,
			verticality: "flat",
		},
		attack: {
			cap: 1,
			damage: 1,
			range: 1,
			verticality: "flat",
		},
	},

	knight: {
		cost: 6,
		health: 3,
		actionCap: 2,
		stakeholder: false,
		spawning: null,
		vision: {
			range: 2,
			verticality: "downwards",
		},
		move: {
			cap: 1,
			range: 2,
			chebyshev: false,
			verticality: "flat",
		},
		attack: {
			cap: 1,
			damage: 2,
			range: 1,
			verticality: "flat",
		},
	},

	rook: {
		cost: 6,
		health: 7,
		actionCap: 1,
		stakeholder: false,
		spawning: null,
		vision: {
			range: 1,
			verticality: "downwards",
		},
		move: {
			cap: 1,
			range: 1,
			chebyshev: false,
			verticality: "flat",
		},
		attack: {
			cap: 1,
			damage: 2,
			range: 1,
			verticality: "everywhere",
		},
	},

	bishop: {
		cost: 7,
		health: 2,
		actionCap: 1,
		stakeholder: false,
		spawning: null,
		vision: {
			range: 2,
			verticality: "downwards",
		},
		move: {
			cap: 1,
			range: 1,
			chebyshev: false,
			verticality: "flat",
		},
		attack: {
			cap: 1,
			damage: 1,
			range: 2,
			verticality: "everywhere",
		},
	},

	queen: {
		cost: 4,
		health: 3,
		actionCap: 1,
		stakeholder: false,
		spawning: {
			verticality: "flat",
		},
		vision: {
			range: 2,
			verticality: "everywhere",
		},
		move: {
			cap: 1,
			range: 3,
			chebyshev: false,
			verticality: "flat",
		},
		attack: {
			cap: 1,
			damage: 1,
			range: 1,
			verticality: "everywhere",
		},
	},
})

