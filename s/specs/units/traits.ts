
export type Verticality = {
	above?: boolean
	below?: boolean
}

export type Multitaskability = {
	repeats?: number
	focusFire?: boolean
	whileMoving?: boolean
}

export type BoardRange = {
	steps: number

	/** defaults to chebyshev */
	kind?: DistanceKind
}

export type DistanceKind = "chebyshev" | "manhattan"

