
import {Trashbin} from "@benev/slate"
import {vec2, Vec2, Vec3} from "@benev/toolbox"

import {Assets} from "../../assets/assets.js"
import {UnitKind} from "../../../config/units.js"
import {Selectacon} from "../../parts/selectacon.js"

type Ghost = {
	place: Vec2
	teamId: number
	unitKind: UnitKind
}

export class SpawnGhostRenderer {
	bin = new Trashbin()
	possibleGhosts: Ghost[] = []

	constructor(private options: {
		assets: Assets
		selectacon: Selectacon
	}) {}

	setPossibleGhost(ghost: Ghost) {
		this.possibleGhosts.push(ghost)
	}

	resetPossibleGhosts() {
		this.possibleGhosts = []
	}

	#instance(ghost: Ghost, position: Vec3) {
		const {assets} = this.options
		const instance = assets.units.faded(ghost.unitKind, ghost.teamId, null)
		this.bin.disposable(instance)
		instance.position.set(...position)
	}

	render() {
		this.bin.dispose()
		const {selectacon} = this.options

		const hover = selectacon.hover.value

		if (hover?.kind === "tile") {
			for (const ghost of this.possibleGhosts) {
				if (vec2.equal(ghost.place, hover.place))
					this.#instance(ghost, hover.position)
			}
		}
	}

	dispose() {
		this.bin.dispose()
	}
}

