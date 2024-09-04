
import {AssetContainer, TransformNode} from "@babylonjs/core"

import {Glb} from "./glb.js"
import {World} from "./world.js"
import {UnitKind} from "../../logic/state.js"

export type AssetUrls = {
	board: string
	units: string
	indicators: string
}

export class Assets {
	static async load(world: World, urls: AssetUrls) {
		const [boardContainer, unitsContainer, indicatorsContainer] = await Promise.all([
			world.loadContainer(urls.board),
			world.loadContainer(urls.units),
			world.loadContainer(urls.indicators),
		])
		const indicatorsGlb = new IndicatorsGlb(indicatorsContainer)
		const boardGlb = new BoardGlb(boardContainer)
		const unitsGlb = new UnitsGlb(unitsContainer, boardGlb)
		return new this(boardGlb, unitsGlb, indicatorsGlb)
	}

	constructor(
		public board: BoardGlb,
		public units: UnitsGlb,
		public indicators: IndicatorsGlb,
	) {}

	dispose() {
		this.board.container.dispose()
		this.units.container.dispose()
		this.indicators.container.dispose()
	}
}

export class BoardGlb extends Glb {
	border = () => this.instance(`border8x8`)
	block = (elevation: number, alt: string) => this.instance(`block${elevation}-${alt}`)
	step = (elevation: number, alt: string) => this.instance(`step${elevation}-${alt}`)
	obstacle = () => this.instance(`obstacle12`)
	roster = (teamId: number) => this.instance(`team${teamId + 1}-roster`)
}

export class UnitsGlb extends Glb {
	constructor(container: AssetContainer, private themeGlb: BoardGlb) {
		super(container)
	}

	#team(teamId: null | number) {
		return teamId === null
			? "null"
			: (teamId + 1).toString()
	}

	ring = () => this.instance("ring")

	unit = new Map<UnitKind, (teamId: null | number) => TransformNode>()
		.set("obstacle", () => this.themeGlb.obstacle())
		.set("king", teamId => this.instance(`unit-team${this.#team(teamId)}-king`))
		.set("queen", teamId => this.instance(`unit-team${this.#team(teamId)}-queen`))
		.set("bishop", teamId => this.instance(`unit-team${this.#team(teamId)}-bishop`))
		.set("knight", teamId => this.instance(`unit-team${this.#team(teamId)}-knight`))
		.set("rook", teamId => this.instance(`unit-team${this.#team(teamId)}-rook`))
		.set("pawn", teamId => this.instance(`unit-team${this.#team(teamId)}-pawn`))
		.set("elephant", teamId => this.instance(`unit-team${this.#team(teamId)}-elephant`))
}

export class IndicatorsGlb extends Glb {
	lol = (() => {
		console.log([...this.props.keys()])
	})()

	aura = this.instancer("aura")
	selection = this.instancer(`selected`)
	hover = (team: number | null) => this.instance(`hover-${teamName(team)}`)

	liberty = (team: number | null) => ({
		action: this.instancer(`liberty-action-${teamName(team)}`),
		pattern: this.instancer(`liberty-pattern-${teamName(team)}`),
	})

	attack = ({
		action: this.instancer(`attack`),
		pattern: this.instancer(`attack-pattern`),
	})

	claims = {
		corners: (on: boolean) => this.instance(`claim-${on ? "on" : "off"}`),
		resource: (level: number) => this.instance(`claim-resource${level}`),
		specialResource: this.instancer(`claim-special-resource`),
		knight: this.instancer(`claim-knight`),
		rook: this.instancer(`claim-rook`),
		bishop: this.instancer(`claim-bishop`),
		queen: this.instancer(`claim-queen`),
		elephant: this.instancer(`claim-elephant`),
		watchtower: this.instancer(`claim-watchtower`),
	}
}

function teamName(team: number | null) {
	return team === null
		? "neutral"
		: `team${team + 1}`
}

