
import {Vec2} from "@benev/toolbox"
import {pubsub} from "@benev/slate"
import {Grid, Tile, Unit, Units} from "../logic/concepts"

type Selectoid = {
	place: Vec2
	tile: Tile
	unit: Unit | undefined
}

export class Selectacon {
	selected: Selectoid | undefined
	onSelected = pubsub<[Selectoid | undefined]>()

	constructor(private grid: Grid, private units: Units) {}

	select(place: Vec2) {
		const tile = this.grid.at(place)
		const found = this.units.at(place)
		const selected = {place, tile, unit: found?.unit}
		this.selected = selected
		this.onSelected.publish(selected)
		return selected
	}
}

