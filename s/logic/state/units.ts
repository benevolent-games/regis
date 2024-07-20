
import {Vec2} from "@benev/toolbox"

export type Units = UnitEntry[]
export type UnitEntry = [string, Unit]

export type Unit = {
	place: Vec2
	kind: UnitKind
	team: null | number
	damage: number
}

export type Verticality = {
	above: boolean
	same: boolean
	below: boolean
}

export const verticality = {
	flat: {above: false, same: true, below: false},
	downwards: {above: false, same: true, below: true},
	upwards: {above: true, same: true, below: false},
	everywhere: {above: true, same: true, below: true},
} satisfies Record<string, Verticality>

export type UnitArchetype = {
	cost: null | number
	health: null | number
	royalty: boolean
	claimant: boolean
	vision: null | {
		range: number
		verticality: Verticality
	}
	move: null | {
		range: number
		verticality: Verticality
	}
	attack: null | {
		damage: number
		range: number
		verticality: Verticality
	}
}

export type UnitKind = keyof typeof unitArchetypes

export const unitArchetypes = {
	obstacle: {
		cost: null,
		health: 8,
		royalty: false,
		claimant: false,
		vision: null,
		move: null,
		attack: null,
	},

	king: {
		cost: null,
		health: 4,
		royalty: true,
		claimant: false,
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
		cost: 16,
		health: 3,
		royalty: true,
		claimant: false,
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
		cost: 16,
		health: 3,
		royalty: false,
		claimant: false,
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
		},
	},

	knight: {
		cost: 8,
		health: 3,
		royalty: false,
		claimant: false,
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
		cost: 12,
		health: 5,
		royalty: false,
		claimant: false,
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
		cost: 6,
		health: 2,
		royalty: false,
		claimant: false,
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
}

