
export type Verticality = {
	above?: boolean
	below?: boolean
}

export type Repeatability = {
	count?: number
	focusFire?: boolean
}

export type BoardRange = {
	steps: number

	/** defaults to chebyshev */
	kind?: DistanceKind
}

export type DistanceKind = "chebyshev" | "manhattan"

