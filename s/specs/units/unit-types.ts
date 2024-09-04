
import {deep, ob} from "@benev/slate"
import {unitSpecs} from "../units.js"
import {Archetype} from "./archetype.js"
import {UnitRendering} from "./rendering.js"

export type UnitSpec = {
	archetype: Archetype
	rendering: UnitRendering
}

export type UnitName = keyof typeof unitSpecs

export function standardArchetypes() {
	return ob(unitSpecs).map(spec => deep.clone(spec.archetype))
}

