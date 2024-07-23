
import {Vec2} from "@benev/toolbox"
import {Unit} from "../logic/state/units.js"
import {Tile} from "../logic/state/board.js"

export type UiState = {
	playableTeams: number[]
	hover: null | {
		place: Vec2
	}
	selection: null | {
		tile: Tile
		place: Vec2
		unit: Unit | undefined
	}
}

export class Ui {
	state: UiState = {
		hover: null,
		selection: null,
		playableTeams: [0, 1],
	}
}

