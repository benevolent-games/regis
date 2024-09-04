
import {deep, ob} from "@benev/slate"
import {unitConfigs} from "../units.js"
import {Archetype} from "./archetype.js"
import {UnitRendering} from "./rendering.js"

export type UnitConfig = {
	archetype: Archetype
	rendering: UnitRendering
}

export type UnitName = keyof typeof unitConfigs

export function standardArchetypes() {
	return ob(unitConfigs).map(spec => deep.clone(spec.archetype))
}

