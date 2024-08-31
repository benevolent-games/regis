
import {GameConfig, InitialTeamInfo, Roster, UnitArchetype, UnitKind, VerticalCapability} from "./state.js"

export function defaultGameConfig(): GameConfig {
	const unitArchetypes = defaultUnitArchetypes()
	return {
		startingResources: 8,
		universalBasicIncome: 2,
		teams: defaultTeams(),
		costs: {
			investment: 10,
			staking: {
				resource: 6,
				watchtower: 0,
				tech: {
					knight: 6,
					rook: 6,
					bishop: 6,
					queen: 6,
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

export const verticality = {
	flat: {above: false, below: false},
	downwards: {above: false, below: true},
	upwards: {above: true, below: false},
	everywhere: {above: true, below: true},
} satisfies Record<string, VerticalCapability>

export type UnitArchetypes = Record<UnitKind, UnitArchetype>

export const defaultUnitArchetypes = (): UnitArchetypes => ({
	obstacle: {
		cost: null,
		health: 10,
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
			verticality: verticality.flat,
		},
		vision: {
			range: 2,
			verticality: verticality.downwards,
		},
		move: {
			cap: 1,
			range: 2,
			verticality: verticality.flat,
		},
		attack: {
			cap: 1,
			damage: 1,
			range: 1,
			verticality: verticality.flat,
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
			verticality: verticality.downwards,
		},
		move: {
			cap: 1,
			range: 2,
			verticality: verticality.flat,
		},
		attack: {
			cap: 1,
			damage: 1,
			range: 1,
			verticality: verticality.flat,
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
			verticality: verticality.downwards,
		},
		move: {
			cap: 1,
			range: 2,
			verticality: verticality.flat,
		},
		attack: {
			cap: 1,
			damage: 2,
			range: 1,
			verticality: verticality.flat,
		},
	},

	rook: {
		cost: 7,
		health: 7,
		actionCap: 1,
		stakeholder: false,
		spawning: null,
		vision: {
			range: 1,
			verticality: verticality.downwards,
		},
		move: {
			cap: 1,
			range: 1,
			verticality: verticality.flat,
		},
		attack: {
			cap: 1,
			damage: 2,
			range: 1,
			verticality: verticality.everywhere,
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
			verticality: verticality.downwards,
		},
		move: {
			cap: 1,
			range: 1,
			verticality: verticality.flat,
		},
		attack: {
			cap: 1,
			damage: 1,
			range: 2,
			verticality: verticality.everywhere,
		},
	},

	queen: {
		cost: 5,
		health: 3,
		actionCap: 1,
		stakeholder: false,
		spawning: {
			verticality: verticality.flat,
		},
		vision: {
			range: 2,
			verticality: verticality.everywhere,
		},
		move: {
			cap: 1,
			range: 3,
			verticality: verticality.flat,
		},
		attack: {
			cap: 1,
			damage: 1,
			range: 1,
			verticality: verticality.everywhere,
		},
	},
})

