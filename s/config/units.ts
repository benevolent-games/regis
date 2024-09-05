
import {deep, ob} from "@benev/slate"
import {Archetypes} from "./units/archetype.js"
import {UnitConfig} from "./units/unit-config.js"

export type UnitKind = keyof typeof unitsConfig

export const unitsConfig = deep.freeze({
	obstacle: {
		rendering: {algo: "obstacle"},
		archetype: {
			explained: {sentence: "Destructible thing that blocks a tile."},
			mortal: {health: 12},
		},
	},

	king: {
		rendering: {algo: "normal"},
		archetype: {
			explained: {sentence: "Game ends when he dies, can see up cliffs, acts as a spawnpoint."},
			mortal: {health: 5},
			mobile: {range: {steps: 1}},
			sighted: {range: {steps: 1}, verticality: {above: true, below: true}},
			armed: {damage: 1, range: {steps: 1}, multitasking: {whileMoving: true}},
			summoner: {limit: 2, range: {steps: 1}},
		},
	},

	queen: {
		rendering: {algo: "normal"},
		archetype: {
			explained: {sentence: "Specialist scout, medic, spawnpoint."},
			mortal: {health: 4},
			armed: {damage: 1, range: {steps: 1}},
			mobile: {range: {steps: 3, kind: "manhattan"}},
			sighted: {range: {steps: 2}, verticality: {below: true}},
			healer: {healing: 1, range: {steps: 1}, multitasking: {whileMoving: true}},
			summoner: {limit: 1, range: {steps: 1}},
			recruitable: {cost: 4, unlockable: {price: 0}},
		},
	},

	bishop: {
		rendering: {algo: "normal"},
		archetype: {
			explained: {sentence: "Archer, deals damage at a distance, but vulnerable if unprotected."},
			mortal: {health: 2},
			armed: {damage: 1, range: {steps: 2}},
			mobile: {range: {steps: 1, kind: "manhattan"}},
			sighted: {range: {steps: 2}, verticality: {below: true}},
			recruitable: {cost: 4, unlockable: {price: 4}},
		},
	},

	knight: {
		rendering: {algo: "normal"},
		archetype: {
			explained: {sentence: "Aggressive cavalry, strong against pawns and bishops."},
			mortal: {health: 3},
			armed: {damage: 2, range: {steps: 1}},
			mobile: {range: {steps: 2, kind: "manhattan"}},
			sighted: {range: {steps: 2}, verticality: {below: true}},
			recruitable: {cost: 6, unlockable: {price: 4}},
		},
	},

	rook: {
		rendering: {algo: "normal"},
		archetype: {
			explained: {sentence: "Stalwart defender, strong but slow, can shoot over cliffs."},
			mortal: {health: 7},
			armed: {damage: 2, range: {steps: 1}, verticality: {above: true, below: true}},
			mobile: {range: {steps: 1, kind: "manhattan"}},
			sighted: {range: {steps: 1}, verticality: {below: true}},
			recruitable: {cost: 6, unlockable: {price: 4}},
		},
	},

	pawn: {
		rendering: {algo: "normal"},
		archetype: {
			explained: {sentence: "Peasant worker, can stake claims, formidible in numbers."},
			mortal: {health: 3},
			armed: {damage: 1, range: {steps: 1}},
			mobile: {range: {steps: 2, kind: "manhattan"}},
			sighted: {range: {steps: 2}, verticality: {below: true}},
			stakeholder: {},
			recruitable: {cost: 4},
		},
	},

	elephant: {
		rendering: {algo: "normal"},
		archetype: {
			explained: {sentence: "Rampaging beast, no chains can bind him..."},
			mortal: {health: 12},
			armed: {damage: 4, range: {steps: 1}, multitasking: {repeats: 2, focusFire: true, whileMoving: true}},
			mobile: {range: {steps: 2, kind: "manhattan"}},
			sighted: {range: {steps: 2}, verticality: {below: true}},
			recruitable: {cost: 32, unlockable: {price: 4}},
		},
	},

}) satisfies Record<string, UnitConfig>

export function standardArchetypes(): Archetypes {
	return ob(unitsConfig).map(spec => deep.clone(spec.archetype))
}

