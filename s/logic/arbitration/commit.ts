
import {clone} from "@benev/slate"
import {scalar, vec2, Vec2} from "@benev/toolbox"

import {Tile} from "../state/board.js"
import {GameState, Incident} from "../state/game.js"

export function commit(original: GameState, incident: Incident.Any): GameState {
	const state = clone(original)

	if (incident.kind === "conclusion") {
		state.context.winner = incident.winner
	}
	else if (incident.kind === "action") {
		if (incident.name === "move") {
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
		}
		else if (incident.name === "attack") {
			throw new Error("TODO implement attack")
		}
		else if (incident.name === "yield") {
			const teamCount = state.initiation.teams.length
			state.context.currentTurn = scalar.wrap(teamCount + 1, 0, teamCount - 1)
		}
	}

	state.chronicle.push(incident)
	return state
}

////////////////////////////////////////////////
////////////////////////////////////////////////

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

