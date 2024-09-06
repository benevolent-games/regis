
import {Tile} from "../state.js"
import {UnitKind} from "../../config/units.js"
import {ResourceLevel} from "../../config/game/types.js"

export const defaultClaims = (tile: Tile) => ({

	resource: (level: ResourceLevel) => tile.claims.push({
		kind: "resource",
		level,
		stockTaken: 0,
	}),

	specialResource: () => tile.claims.push({
		kind: "specialResource",
		stockTaken: 0,
	}),

	watchtower: () => tile.claims.push({
		kind: "watchtower",
		range: {steps: 2, kind: "chebyshev"},
	}),

	tech: (...unlocks: UnitKind[]) => unlocks.forEach(
		unlock => tile.claims.push({kind: "tech", unlock})
	),
})

