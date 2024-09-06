
import {BoardRange, Repeatability, Verticality} from "./traits.js"

export type Archetypes = Record<string, Archetype>

export type Archetype = Partial<Aspects>

export function asArchetype<A extends Archetype>(a: A) {
	return a
}

export type Aspects = {
	explained: {
		sentence: string
	}

	mortal: {
		health: number
	}

	armed: {
		damage: number
		range: BoardRange
		verticality?: Verticality
		repeatable?: Repeatability
	}

	mobile: {
		range: BoardRange
		verticality?: Verticality
	}

	sighted: {
		range: BoardRange
		verticality?: Verticality
	}

	healer: {
		healing: number
		range: BoardRange
		verticality?: Verticality
		repeatable?: Repeatability
	}

	stakeholder: {},

	recruiter: {
		range: BoardRange
		verticality?: Verticality
	}

	recruitable: {
		cost: number
		limit?: number
		unlockable?: {price: number}
	}

	multitasker: {
		count: number
	}
}

