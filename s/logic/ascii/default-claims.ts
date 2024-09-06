
import {Tile} from "../state.js"
import {UnitKind} from "../../config/units.js"
import {ResourceLevel} from "../../config/game/types.js"

const stock = 32

export const defaultClaims = (tile: Tile) => ({
	resource: (level: ResourceLevel) => tile.claims.push({
		kind: "resource",
		level,
		stockpile: stock * level,
	}),
	specialResource: () => tile.claims.push({
		kind: "specialResource",
		stockpile: stock,
	}),
	watchtower: () => tile.claims.push({
		kind: "watchtower",
		range: {steps: 2, kind: "chebyshev"},
	}),
	tech: (...unlocks: UnitKind[]) => unlocks.forEach(
		unlock => tile.claims.push({kind: "tech", unlock})
	),
})

