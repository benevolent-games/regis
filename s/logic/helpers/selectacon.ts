
import {Vec2} from "@benev/toolbox"
import {pubsub} from "@benev/slate"

import {unitry} from "./unitry.js"
import {boardery} from "./boardery.js"
import {Board, Tile} from "../state/board.js"
import {Unit, Units} from "../state/units.js"
import {wherefor} from "../../tools/wherefor.js"

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
		const tile = boardery(this.board).at(place)
		const unit = wherefor(
			unitry(this.units).at(place),
			([,unit]) => unit,
		)
		const selected = {tile, place, unit}
		this.selected = selected
		this.onSelected.publish(selected)
		return selected
	}
}

