
import {vec2, Vec2} from "@benev/toolbox"
import {Agent} from "../../agent.js"
import {getCardinalNeighbors} from "./navigation.js"

export function isValidSpawnPlace(agent: Agent, teamId: number, place: Vec2) {
	return [...agent.units.list()]

		// filter for current team
		.filter(unit => unit.team === teamId)

		// unit is royalty
		.filter(unit => agent.archetype(unit.kind).royalty)

		// get neighbors
		.flatMap(unit => getCardinalNeighbors(agent, unit.place))

		// filter for vacancies
		.filter(neighbor => !agent.units.at(neighbor))

		// is the place a valid spawnpoint
		.some(v => vec2.equal(v, place))
}

