
import {TransformNode} from "@babylonjs/core"

import {Glb} from "./tools/glb.js"
import {Unit, UnitKind} from "../logic/state/units.js"

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

	border() {
		return this.instance(`border8x8`)
	}

	#blockvariant(variant: BlockVariant) {
		return variant === "normal" ? "" : `-${variant}`
	}

	block = (elevation: number, variant: BlockVariant) => {
		return this.instance(`block${elevation}${this.#blockvariant(variant)}`)
	}

	step = (elevation: number, variant: BlockVariant) => {
		return this.instance(`step${elevation}${this.#blockvariant(variant)}`)
	}

	obstacle = () => this.instance(`obstacle`)
}

