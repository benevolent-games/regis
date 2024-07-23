
import {Vec2} from "@benev/toolbox"
import {Unit} from "../logic/state/units.js"
import {Tile} from "../logic/state/board.js"

export type Hover = {
	place: Vec2
}

export type Selected = {
	tile: Tile
	place: Vec2
	unit: Unit | undefined
}

export type UiState = {
	playableTeams: number[]
	hover: null | Hover
	selection: null | Selected
}

export class Ui {
	state: UiState = {
		hover: null,
		selection: null,
		playableTeams: [0, 1],
	}
}

