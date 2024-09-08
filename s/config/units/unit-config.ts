
import {Archetype} from "./archetype.js"
import {UnitRendering} from "./rendering.js"

export type UnitConfig = {
	archetype: Archetype
	rendering: UnitRendering
}

export function asUnitConfig<C extends UnitConfig>(c: C) {
	return c
}

export function asUnitsConfig<C extends Record<string, UnitConfig>>(c: C) {
	return c
}

