
import {deep, ob} from "@benev/slate"
import {Archetypes} from "./units/archetype.js"
import {asUnitsConfig} from "./units/unit-config.js"

export type UnitKind = keyof typeof unitsConfig

export function standardArchetypes(): Archetypes {
	return ob(unitsConfig).map(spec => deep.clone(spec.archetype))
}

export const unitsConfig = deep.freeze(asUnitsConfig({
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
			explained: {sentence: "Game ends when he dies, can see up cliffs, acts as recruitment point."},
			mortal: {health: 5},
			mobile: {range: {steps: 1}},
			sighted: {range: {steps: 2}, verticality: {above: true, below: true}},
			armed: {damage: 1, range: {steps: 1}},
			recruiter: {range: {steps: 1}},
			multitasker: {count: 2},
		},
	},

	queen: {
		rendering: {algo: "normal"},
		archetype: {
			explained: {sentence: "Specialist scout, medic, recruiter."},
			recruitable: {cost: 4, unlockable: {price: 0}},
			mortal: {health: 4},
			armed: {damage: 1, range: {steps: 1}},
			mobile: {range: {steps: 3, kind: "manhattan"}},
			sighted: {range: {steps: 2}, verticality: {above: true, below: true}},
			healer: {healing: 1, range: {steps: 1}},
			recruiter: {range: {steps: 1}},
		},
	},

	bishop: {
		rendering: {algo: "normal"},
		archetype: {
			explained: {sentence: "Archer, deals damage at a distance, but vulnerable if unprotected."},
			recruitable: {cost: 4, unlockable: {price: 4}},
			mortal: {health: 2},
			armed: {damage: 1, range: {steps: 2}, repeatable: {count: 2, focusFire: true}, verticality: {above: true, below: true}},
			mobile: {range: {steps: 1, kind: "manhattan"}},
			sighted: {range: {steps: 2}, verticality: {below: true}},
		},
	},

	knight: {
		rendering: {algo: "normal"},
		archetype: {
			explained: {sentence: "Aggressive cavalry, strong against pawns and bishops."},
			recruitable: {cost: 6, unlockable: {price: 4}},
			mortal: {health: 3},
			armed: {damage: 2, range: {steps: 1}, repeatable: {count: 2}},
			mobile: {range: {steps: 2, kind: "manhattan"}},
			sighted: {range: {steps: 2}, verticality: {below: true}},
			multitasker: {count: 2},
		},
	},

	rook: {
		rendering: {algo: "normal"},
		archetype: {
			explained: {sentence: "Stalwart defender, strong but slow, can shoot over cliffs."},
			recruitable: {cost: 6, unlockable: {price: 4}},
			mortal: {health: 7},
			armed: {damage: 2, range: {steps: 1}, verticality: {above: true, below: true}},
			mobile: {range: {steps: 1, kind: "manhattan"}},
			sighted: {range: {steps: 1}, verticality: {below: true}},
		},
	},

	pawn: {
		rendering: {algo: "normal"},
		archetype: {
			explained: {sentence: "Peasant worker, can stake claims, formidible in numbers."},
			recruitable: {cost: 4},
			mortal: {health: 3},
			armed: {damage: 1, range: {steps: 1}},
			mobile: {range: {steps: 2, kind: "manhattan"}},
			sighted: {range: {steps: 2}, verticality: {below: true}},
			stakeholder: {},
			multitasker: {count: 2},
		},
	},

	elephant: {
		rendering: {algo: "normal"},
		archetype: {
			explained: {sentence: "Rampaging beast, no chains can bind him..."},
			recruitable: {cost: 32, unlockable: {price: 12}},
			mortal: {health: 12},
			armed: {damage: 3, range: {steps: 1}, repeatable: {count: 2, focusFire: true}},
			mobile: {range: {steps: 2, kind: "manhattan"}},
			sighted: {range: {steps: 2}, verticality: {below: true}},
			multitasker: {count: 2},
		},
	},

}))

