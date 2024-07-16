
import {loop2d, Vec2} from "@benev/toolbox"

export type Elevation = 1 | 2 | 3

export type Tile = {
	elevation: Elevation
	resource: boolean
	watchTower: boolean
	step: boolean
}

export type BoardState = {
	extent: Vec2
	tiles: Tile[]
}

export function makeDefaultBoardState(): BoardState {
	const extent: Vec2 = [8, 8]
	const tiles = [...loop2d(extent)].map((): Tile => ({
		step: false,
		elevation: 1,
		resource: false,
		watchTower: false,
	}))
	return {extent, tiles}
}

