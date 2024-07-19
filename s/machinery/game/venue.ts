
import {deep} from "@benev/slate"

import {TeamState} from "../teams/data.js"
import {asciiMap} from "../ascii/ascii-map.js"
import {BoardAuthor} from "../board/author.js"
import {UnitsAuthor} from "../units/author.js"
import {AgentState, Incident, Initiation, Situation} from "./data.js"

type Options = {
	ascii: string
	teams: TeamState[]
}

export class Venue {
	initiation: Initiation
	board: BoardAuthor
	units: UnitsAuthor
	teams: TeamState[]
	chronicle: Incident.Any[] = []
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
}

