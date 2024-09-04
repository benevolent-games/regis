
import { deep, ob } from "@benev/slate"
import {Archetype} from "./archetype.js"
import {unitSpecs} from "../unit-specs.js"
import {UnitRendering} from "./rendering.js"

export type UnitSpec = {
	archetype: Archetype
	rendering: UnitRendering
}

export type UnitName = keyof typeof unitSpecs

export function standardArchetypes() {
	return ob(unitSpecs).map(spec => deep.clone(spec.archetype))
}

