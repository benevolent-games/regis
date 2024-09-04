
import {BoardRange, Multitaskability, Verticality} from "./traits"

export type Archetype = Partial<Aspects>

export type Aspects = {
	mortal: {
		health: number
	}

	recruitable: {
		cost: number
		unlockable?: {price: number}
	}

	sighted: {
		range: BoardRange
		verticality?: Verticality
	}

	mobile: {
		range: BoardRange
		verticality?: Verticality
	}

	armed: {
		damage: number
		range: BoardRange
		verticality?: Verticality
		multitasking?: Multitaskability
	}

	healer: {
		healing: number
		range: BoardRange
		verticality?: Verticality
		multitasking?: Multitaskability
	}

	summoner: {
		range: BoardRange
		limit?: number
	}

	stakeholder: {},
}

