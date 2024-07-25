
import {Vec2} from "@benev/toolbox"
import {Unit, Tile} from "../logic2/state.js"

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

