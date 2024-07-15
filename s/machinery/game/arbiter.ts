
import {deep} from "@benev/slate"
import {scalar, vec2, Vec2} from "@benev/toolbox"

import {Tile} from "../board/data.js"
import {TeamState} from "../teams/data.js"
import {asciiMap} from "../ascii/ascii-map.js"
import {BoardAuthor} from "../board/author.js"
import {UnitsAuthor} from "../units/author.js"
import {actionActuators, AgentState, Incident, Initiation, Situation} from "./data.js"

type Options = {
	ascii: string
	teams: TeamState[]
}

export class Arbiter {

	// the rest of this tracks the current state
	chronicle: Incident.Any[] = []
	initiation: Initiation
	board: BoardAuthor
	units: UnitsAuthor
	teams: TeamState[]
	situation: Situation

	constructor({ascii, teams}: Options) {
		const {board, units} = asciiMap(ascii)
		this.board = board
		this.units = units
		this.teams = teams
		this.initiation = {
			teams,
			board: board.state,
			units: units.state,
		}
		this.situation = {
			currentTurn: 0,
			winner: null,
		}
	}

	generateAgentState(_team: number | null): AgentState {
		return deep.freeze({
			teams: this.teams,
			board: this.board.state,
			units: this.units.state,
			situation: this.situation,
		})
	}

	commit(incident: Incident.Any) {
		if (incident.kind === "conclusion")
			this.#conclude(incident)
		else if (incident.kind === "action")
			this.#actions[incident.name](incident as any)
		this.chronicle.push(incident)
	}

	#conclude(incident: Incident.Conclusion) {
		this.situation.winner = incident.winner
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
			const teamCount = this.initiation.teams.length
			this.situation.currentTurn = scalar.wrap(teamCount + 1, 0, teamCount - 1)
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

