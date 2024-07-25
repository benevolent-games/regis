
import {AssetContainer, TransformNode} from "@babylonjs/core"

import {Glb} from "./glb.js"
import {World} from "./world.js"
import { Unit, UnitKind } from "../../../logic2/state.js"

export type AssetUrls = {
	theme: string
	units: string
	indicators: string
}

export class Assets {
	static async load(world: World, urls: AssetUrls) {
		const [themeContainer, unitsContainer, indicatorsContainer] = await Promise.all([
			world.loadContainer(urls.theme),
			world.loadContainer(urls.units),
			world.loadContainer(urls.indicators),
		])
		const themeGlb = new ThemeGlb(themeContainer)
		const unitsGlb = new UnitsGlb(unitsContainer, themeGlb)
		const indicatorsGlb = new IndicatorsGlb(indicatorsContainer)
		return new this(themeGlb, unitsGlb, indicatorsGlb)
	}

	constructor(
		public theme: ThemeGlb,
		public units: UnitsGlb,
		public indicators: IndicatorsGlb,
	) {}

	dispose() {
		this.theme.container.dispose()
		this.units.container.dispose()
		this.indicators.container.dispose()
	}
}

export class ThemeGlb extends Glb {
	border = () => this.instance(`border8x8`)
	block = (elevation: number, alt: string) => this.instance(`block${elevation}-${alt}`)
	step = (elevation: number, alt: string) => this.instance(`step${elevation}-${alt}`)
	obstacle = () => this.instance(`obstacle12`)
}

export class UnitsGlb extends Glb {
	constructor(container: AssetContainer, private themeGlb: ThemeGlb) {
		super(container)
	}

	#team(unit: Unit) {
		return unit.team === null
			? "null"
			: (unit.team + 1).toString()
	}

	unit = new Map<UnitKind, (unit: Unit) => TransformNode>()
		.set("obstacle", () => this.themeGlb.obstacle())
		.set("king", unit => this.instance(`unit-team${this.#team(unit)}-king`))
		.set("queen", unit => this.instance(`unit-team${this.#team(unit)}-queen`))
		.set("bishop", unit => this.instance(`unit-team${this.#team(unit)}-bishop1`))
		.set("knight", unit => this.instance(`unit-team${this.#team(unit)}-knight1`))
		.set("rook", unit => this.instance(`unit-team${this.#team(unit)}-rook1`))
		.set("pawn", unit => this.instance(`unit-team${this.#team(unit)}-pawn1`))
}

export class IndicatorsGlb extends Glb {
	selection = () => this.instance(`indicator-selected`)
	hover = (teamId: number) => this.instance(`indicator-hover-team${teamId + 1}`)
	liberty = () => this.instance(`indicator-liberty`)
	attack = () => this.instance(`indicator-attack`)
}

