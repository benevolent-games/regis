
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
		resourceValue: 1,
		specialResourceValue: 3,
		teams: defaultTeams(),
		costs: {
			staking: {
				watchtower: 0,
				resources: [4, 12, 16],
				specialResource: 4,
				tech: {
					knight: 4,
					rook: 4,
					bishop: 4,
					queen: 0,
					elephant: 12,
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
		elephant: 99,
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
			verticality: "everywhere",
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
		health: 4,
		actionCap: 1,
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
			range: 3,
			chebyshev: false,
			verticality: "flat",
		},
		attack: {
			cap: 1,
			damage: 6,
			range: 1,
			verticality: "flat",
		},
	},


	elephant: {
		cost: 32,
		health: 12,
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
			cap: 2,
			damage: 6,
			range: 1,
			verticality: "flat",
		},
	},
})

