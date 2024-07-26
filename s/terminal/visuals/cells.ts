
import {Vec2, Vec3} from "@benev/toolbox"

import {Agent} from "../../logic/agent.js"
import {Tile, Unit, UnitKind} from "../../logic/state.js"

export class Selectacon2 {
	constructor(agent: Agent) {}
}

///////////////////////////////////////////
///////////////////////////////////////////

export type TileCell = {
	kind: "tile"
	place: Vec2
	tile: Tile
	position: Vec3
	unit: Unit | undefined
}

export type RosterCell = {
	kind: "roster"
	position: Vec3
	unitKind: UnitKind
}

export type Cell = TileCell | RosterCell

