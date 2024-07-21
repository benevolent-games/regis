
import {TransformNode} from "@babylonjs/core"

import {Glb} from "./tools/glb.js"
import {Unit, UnitKind} from "../logic/state/units.js"

export type BlockVariant = "normal" | "vision" | "hover"

function teamNumber(unit: Unit) {
	return unit.team === null
		? "null"
		: (unit.team + 1).toString()
}

export class ChessGlb extends Glb {
	unit = new Map<UnitKind, (unit: Unit) => TransformNode>()
		.set("obstacle", () => this.instance(`obstacle12`))
		.set("king", unit => this.instance(`unit-team${teamNumber(unit)}-king`))
		.set("queen", unit => this.instance(`unit-team${teamNumber(unit)}-queen`))
		.set("bishop", unit => this.instance(`unit-team${teamNumber(unit)}-bishop1`))
		.set("knight", unit => this.instance(`unit-team${teamNumber(unit)}-knight1`))
		.set("rook", unit => this.instance(`unit-team${teamNumber(unit)}-rook1`))
		.set("pawn", unit => this.instance(`unit-team${teamNumber(unit)}-pawn1`))

	border() {
		return this.instance(`border8x8`)
	}

	#blockvariant(variant: BlockVariant) {
		return variant === "normal" ? "" : `-${variant}`
	}

	block = (elevation: number, variant: BlockVariant) => {
		return this.instance(`block${elevation}${this.#blockvariant(variant)}-v1`)
	}

	step = (elevation: number, variant: BlockVariant) => {
		return this.instance(`step${elevation}${this.#blockvariant(variant)}-v1`)
	}

	obstacle = () => this.instance(`obstacle`)

	indicatorHover = (teamId: number) => this.instance(`indicator-hover-team${teamId + 1}`)
}

