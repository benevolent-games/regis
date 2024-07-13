
import {Vec2} from "@benev/toolbox"

export type UnitsState = {
	entries: [number, Unit][]
}

export type Unit = {
	place: Vec2
	kind: UnitKind
	team: null | number
	damage: number
}

export type UnitArchetype = {
	cost: null | number
	cap: null | number
	health: null | number
	vision: null | {
		pattern: string
		seeUpCliffs: boolean
		seeDownCliffs: boolean
	}
	move: null | {
		cost: number
		pattern: string
		jump: boolean
		cap: null | number
	}
	attack: null | {
		cost: number
		kind: "melee" | "ranged"
		pattern: string
		cap: null | number
	}
	captureResource: null | {
		cost: number
	}
	captureWatchtower: null | {
		cost: number
	}
}

const patterns = {
	omni1: `
		|xxx
		|x@x
		|xxx
	`,
	omni2: `
		|xxxxx
		|xx@xx
		|xxxxx
	`,
	cardinal1: `
		| x
		|x@x
		| x
	`,
	ordinal1: `
		|x x
		| @
		|x x
	`,
}

export type UnitKind = keyof typeof unitArchetypes

export const unitArchetypes = {
	obstacle: {
		health: 12,

		cost: null,
		cap: null,
		vision: null,
		move: null,
		attack: null,
		captureResource: null,
		captureWatchtower: null,
	},

	king: {
		cost: null,
		cap: 3,
		health: 2,
		vision: {
			seeUpCliffs: false,
			seeDownCliffs: true,
			pattern: patterns.omni1,
		},
		move: {
			cost: 1,
			jump: false,
			pattern: patterns.cardinal1,
			cap: null,
		},
		attack: null,
		captureWatchtower: {
			cost: 0,
		},
		captureResource: null,
	},

	queen: {
		cost: 20,
		cap: 2,
		health: 2,
		vision: {
			seeUpCliffs: true,
			seeDownCliffs: true,
			pattern: patterns.omni2,
		},
		move: {
			cost: 1,
			cap: null,
			jump: false,
			pattern: patterns.cardinal1,
		},
		attack: null,
		captureResource: null,
		captureWatchtower: {
			cost: 0,
		},
	},

	bishop: {
		cost: 12,
		cap: 2,
		health: 2,
		vision: {
			seeUpCliffs: false,
			seeDownCliffs: true,
			pattern: patterns.omni1,
		},
		move: {
			cost: 1,
			cap: null,
			jump: false,
			pattern: patterns.cardinal1,
		},
		attack: {
			cost: 1,
			cap: null,
			kind: "ranged",
			pattern: patterns.omni2,
		},
		captureResource: null,
		captureWatchtower: {
			cost: 0,
		},
	},

	knight: {
		cost: 4,
		cap: 3,
		health: 2,
		vision: {
			seeUpCliffs: false,
			seeDownCliffs: true,
			pattern: patterns.omni1,
		},
		move: {
			cost: 1,
			cap: null,
			jump: false,
			pattern: patterns.cardinal1,
		},
		attack: {
			cost: 1,
			cap: 2,
			kind: "melee",
			pattern: patterns.omni1,
		},
		captureResource: null,
		captureWatchtower: {
			cost: 0,
		},
	},

	rook: {
		cost: 8,
		cap: 3,
		health: 8,
		vision: {
			seeUpCliffs: false,
			seeDownCliffs: true,
			pattern: patterns.omni1,
		},
		move: {
			cap: 1,
			cost: 2,
			jump: false,
			pattern: patterns.cardinal1,
		},
		attack: {
			cost: 1,
			cap: null,
			kind: "melee",
			pattern: patterns.omni1,
		},
		captureResource: null,
		captureWatchtower: {
			cost: 0,
		},
	},

	pawn: {
		cost: 2,
		cap: 2,
		health: 2,
		vision: {
			seeUpCliffs: false,
			seeDownCliffs: true,
			pattern: patterns.omni1,
		},
		move: {
			cost: 1,
			cap: null,
			jump: false,
			pattern: patterns.cardinal1,
		},
		attack: {
			cost: 1,
			cap: null,
			kind: "melee",
			pattern: patterns.omni1,
		},
		captureResource: {
			cost: 8,
		},
		captureWatchtower: {
			cost: 0,
		},
	},
}

