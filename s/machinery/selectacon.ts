
import {Vec2} from "@benev/toolbox"
import {pubsub} from "@benev/slate"

import {Tile} from "./board/data.js"
import {Unit} from "./units/data.js"
import {Board} from "./board/board.js"
import {Units} from "./units/units.js"

type Selectoid = {
	place: Vec2
	tile: Tile
	unit: Unit | undefined
}

export class Selectacon {
	selected: Selectoid | undefined
	onSelected = pubsub<[Selectoid | undefined]>()

	constructor(private board: Board, private units: Units) {}

	select(place: Vec2) {
		const tile = this.board.at(place)
		const found = this.units.at(place)
		const selected = {place, tile, unit: found?.unit}
		this.selected = selected
		this.onSelected.publish(selected)
		return selected
	}
}

