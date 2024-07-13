
import {Vec2, vec2} from "@benev/toolbox"
import * as GameAction from "./actions.js"
import {Grid, Units, Team, UnitKind, Tile} from "./concepts.js"
import { asciiMap } from "./ascii/ascii-map.js"

type Faction = {
	team: Team
	points: number
	roster: Record<UnitKind, number>
}

function makeFaction(team: Team): Faction {
	return {
		team,
		points: 3,
		roster: {
			obstacle: 0,
			king: 1,
			queen: 1,
			bishop: 2,
			knight: 2,
			rook: 2,
			pawn: 8,
		},
	}
}

export class Arbiter {
	grid: Grid
	units: Units

	activeTurn: Team = 1
	factions = new Map<Team, Faction>()
		.set(1, makeFaction(1))
		.set(2, makeFaction(2))

	player1 = makeFaction(1)
	player2 = makeFaction(2)

	constructor(ascii: string) {
		const level = asciiMap(ascii)
		this.grid = level.grid
		this.units = level.units
	}

	commitTurn(actions: GameAction.Any[]) {
		for (const action of actions)
			this.#actuate(action)
	}

	#actuate(action: GameAction.Any) {
		const {grid, units} = this
		switch (action.kind) {
			case "move": {
				const unitResult = units.at(action.from)
				if (!unitResult) throw new Error("unit not found")
				if (units.at(action.to)) throw new Error("cannot move on top of other unit")
				const tile = grid.at(action.to)
				const considerationA: Consideration = {
					place: action.from,
					tile: grid.at(action.from),
				}
				const considerationB: Consideration = {
					place: action.to,
					tile,
				}
				if (!isTraversable(considerationA, considerationB))
					throw new Error("untraversable")
				unitResult.unit.place = action.to
			}
			case "attack": {
				throw new Error("todo attack")
			}
		}
	}
}

type Consideration = {
	tile: Tile
	place: Vec2
}

function isTraversable(a: Consideration, b: Consideration) {
	return (
		isCardinallyAdjacent(a.place, b.place) &&
		isElevationCompatible(a.tile, b.tile)
	)
}

function isCardinallyAdjacent(a: Vec2, b: Vec2) {
	return [
		vec2.add(a, [1, 0]),
		vec2.add(a, [-1, 0]),
		vec2.add(a, [0, 1]),
		vec2.add(a, [0, -1]),
	].some(valid => vec2.equal(b, valid))
}

function isElevationCompatible(a: Tile, b: Tile) {
	if (a.elevation === b.elevation)
		return true
}

