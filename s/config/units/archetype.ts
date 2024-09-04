
import {BoardRange, Multitaskability, Verticality} from "./traits"

export type Archetypes = Record<string, Archetype>

export type Archetype = Partial<Aspects>

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
		multitasking?: Multitaskability
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
		multitasking?: Multitaskability
	}

	stakeholder: {},

	summoner: {
		range: BoardRange
		limit?: number
	}

	recruitable: {
		cost: number
		limit?: number
		unlockable?: {price: number}
	}
}

