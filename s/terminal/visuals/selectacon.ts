
import {ev} from "@benev/slate"
import {Vec2, Vec3} from "@benev/toolbox"

import {Tiler} from "./tiler.js"
import {Pointing} from "./types.js"
import {Rosters} from "./rosters.js"
import {World} from "./parts/world.js"
import {Assets} from "./parts/assets.js"
import {Agent} from "../../logic/agent.js"
import {Capsule} from "../../tools/capsule.js"
import {Trashbin} from "../../tools/trashbin.js"
import {Tile, UnitKind} from "../../logic/state.js"

export type TileCell = {
	kind: "tile"
	place: Vec2
	tile: Tile
	position: Vec3
}

export type RosterCell = {
	kind: "roster"
	position: Vec3
	unitKind: UnitKind
	teamId: number
}

export type Cell = TileCell | RosterCell

export class Selectacon {
	hover = new Capsule<Cell | null>(null)
	selection = new Capsule<Cell | null>(null)

	#trashbin = new Trashbin()

	constructor(private options: {
			agent: Agent
			assets: Assets
			tiler: Tiler
			rosters: Rosters
			world: World
		}) {

		this.#trashbin.disposer(ev(options.world.canvas, {
			pointerdown: (event: PointerEvent) => {
				if (event.button === 0)
					this.selection.value = this.pick(event)
			},
			pointermove: (event: PointerEvent) => {
				this.hover.value = this.pick(event)
			},
		}))

		this.#trashbin.disposer(this.hover.on(() => this.render()))
		this.#trashbin.disposer(this.selection.on(() => this.render()))
	}

	performSelection(p: Pointing | null) {
		this.selection.value = p ? this.pick(p) : null
	}

	performHover(p: Pointing | null) {
		this.hover.value = p ? this.pick(p) : null
	}

	#hoverbin = new Trashbin()
	#selectbin = new Trashbin()

	#renderHover() {
		const {agent, assets} = this.options
		this.#hoverbin.dispose()
		const cell = this.hover.value

		if (cell) {
			const teamId = agent.state.context.currentTurn
			const instance = assets.indicators.hover(teamId)
			this.#hoverbin.disposable(instance)
			instance.position.set(...cell.position)
		}
	}

	#renderSelection() {
		const {assets} = this.options
		this.#selectbin.dispose()
		const cell = this.selection.value

		if (cell) {
			const instance = assets.indicators.selection()
			instance.position.set(...cell.position)
			this.#selectbin.disposable(instance)
		}
	}

	render() {
		this.#renderHover()
		this.#renderSelection()
	}

	pick(event: Pointing): Cell | null {
		const {agent, world, tiler, rosters} = this.options

		const {pickedMesh} = world.scene.pick(
			event.clientX,
			event.clientY,
			mesh => (
				tiler.placements.has(mesh) ||
				rosters.placements.has(mesh)
			),
		)

		if (pickedMesh) {
			const tilePlacement = tiler.placements.get(pickedMesh)
			const rosterPlacement = rosters.placements.get(pickedMesh)

			if (tilePlacement) {
				const {place} = tilePlacement
				return {
					kind: "tile",
					place,
					tile: agent.tiles.at(place),
					position: agent.coordinator.toPosition(place),
				}
			}
			else if (rosterPlacement) {
				const {teamId, position, unitKind} = rosterPlacement
				return {
					kind: "roster",
					teamId,
					position,
					unitKind,
				}
			}
		}

		return null
	}

	dispose() {
		this.hover.dispose()
		this.selection.dispose()

		this.#trashbin.dispose()
		this.#hoverbin.dispose()
		this.#selectbin.dispose()
	}
}

