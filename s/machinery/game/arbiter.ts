
import {scalar, vec2, Vec2} from "@benev/toolbox"

import {Venue} from "./venue.js"
import {Tile} from "../board/data.js"
import {actionActuators, Incident} from "./data.js"

export class Arbiter {
	constructor(public venue: Venue) {}

	commit(incident: Incident.Any) {
		if (incident.kind === "conclusion")
			this.#conclude(incident)

		else if (incident.kind === "action")
			this.#actions[incident.name](incident as any)

		this.venue.chronicle.push(incident)
	}

	#conclude(incident: Incident.Conclusion) {
		this.venue.situation.winner = incident.winner
	}

	#actions = actionActuators({
		move: (_action: Incident.Action.Move) => {
			throw new Error("TODO implement move")
			// const {grid, units} = this
			// const unitResult = units.at(action.from)
			//
			// if (!unitResult)
			// 	throw new Error("unit not found")
			//
			// if (units.at(action.to))
			// 	throw new Error("cannot move on top of other unit")
			//
			// const tile = grid.at(action.to)
			//
			// const considerationA: Consideration = {
			// 	place: action.from,
			// 	tile: grid.at(action.from),
			// }
			//
			// const considerationB: Consideration = {
			// 	place: action.to,
			// 	tile,
			// }
			//
			// if (!isTraversable(considerationA, considerationB))
			// 	throw new Error("untraversable")
			//
			// unitResult.unit.place = action.to
		},
		attack: (_action: Incident.Action.Move) => {
			throw new Error("TODO implement move")
		},
		yield: (_action: Incident.Action.Move) => {
			const teamCount = this.venue.initiation.teams.length
			this.venue.situation.currentTurn = scalar.wrap(teamCount + 1, 0, teamCount - 1)
		},
	})
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

