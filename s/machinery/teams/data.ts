
import {UnitKind} from "../units/data.js"

export type TeamState = {
	name: string
	resources: number
	roster: Record<UnitKind, number>
}

/** limited info about a team that is behind fog of war */
export type TeamFoggy = {
	name: string
}

export type Roster = Record<UnitKind, number>

export function initializeRoster(): Roster {
	return {
		obstacle: 0,
		king: 1,
		queen: 1,
		bishop: 2,
		knight: 2,
		rook: 2,
		pawn: 8,
	}
}

