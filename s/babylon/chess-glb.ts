
import {TransformNode} from "@babylonjs/core"

import {Glb} from "./tools/glb.js"
import {Unit, UnitKind} from "../machinery/units/data.js"

export type BlockVariant = "normal" | "vision" | "hover"

export class ChessGlb extends Glb {
	unit = new Map<UnitKind, (unit: Unit) => TransformNode>()
		.set("obstacle", () => this.instance(`obstacle`))
		.set("king", unit => this.instance(`unit-team${unit.team}-king`))
		.set("queen", unit => this.instance(`unit-team${unit.team}-queen`))
		.set("bishop", unit => this.instance(`unit-team${unit.team}-bishop`))
		.set("knight", unit => this.instance(`unit-team${unit.team}-knight`))
		.set("rook", unit => this.instance(`unit-team${unit.team}-rook`))
		.set("pawn", unit => this.instance(`unit-team${unit.team}-pawn`))

	#blockvariant(variant: BlockVariant) {
		return variant === "normal" ? "" : `-${variant}`
	}

	block = (elevation: number, variant: BlockVariant) => {
		return this.instance(`block${elevation}${this.#blockvariant(variant)}`)
	}

	ramp = (elevation: number, variant: BlockVariant) => {
		return this.instance(`ramp${elevation}${this.#blockvariant(variant)}`)
	}

	obstacle = () => this.instance(`obstacle`)
}

