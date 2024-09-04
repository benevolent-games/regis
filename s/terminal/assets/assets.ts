
import {AssetContainer, TransformNode} from "@babylonjs/core"

import {Glb} from "./glb.js"
import {World} from "./world.js"
import { ob } from "@benev/slate"
import { defaultUnitArchetypes } from "../../logic/data.js"
import { need } from "../../tools/need.js"
import { Map2 } from "../../tools/map2.js"
import { getTopMeshes } from "./babylon-helpers.js"

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

	ring = () => this.instance("ring")

	unit = (() => {
		console.log("UNITS", [...this.props.keys()])

		const prepare = (kind: UnitKind) => {
			const teamly = (teamId: number) => {
				const name = `unit-team${teamId + 1}-${kind}`
				const normalProp = this.props.require(name)
				const fadedProp = normalProp.clone(normalProp.name, null)!
				getTopMeshes(fadedProp).forEach(mesh => {
					mesh.visibility = 0.6
					this.container.scene.removeMesh(mesh, true)
				})
				return {
					normal: () => Glb.instantiate(normalProp),
					faded: () => Glb.instantiate(fadedProp)
				}
			}
			const map = new Map2<number, ReturnType<typeof teamly>>()
			map.set(0, teamly(0))
			map.set(1, teamly(1))
			return (teamId: number | null) => map.require(teamId!)
		}

		return {
			obstacle: (_teamId: number | null) => ({
				normal: this.themeGlb.obstacle,
				faded: this.themeGlb.obstacle,
			}),
			king: prepare("king"),
			queen: prepare("queen"),
			bishop: prepare("bishop"),
			knight: prepare("knight"),
			rook: prepare("rook"),
			pawn: prepare("pawn"),
			elephant: prepare("elephant"),
		} satisfies Record<UnitKind, any>
	})()
}

export class IndicatorsGlb extends Glb {
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

	heal = ({
		action: this.instancer(`liberty-action-neutral`),
		pattern: this.instancer(`liberty-pattern-neutral`),
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

