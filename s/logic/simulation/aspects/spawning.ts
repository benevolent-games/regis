
import {vec2, Vec2} from "@benev/toolbox"

import {Agent} from "../../agent.js"
import {getCardinalNeighbors} from "./navigation.js"
import {isVerticallyCompatible} from "./verticality.js"

export function isValidSpawnPlace(agent: Agent, teamId: number, place: Vec2) {

	// loop over every unit on the board
	return [...agent.units.list()]

		// filter for current team
		.filter(unit => unit.team === teamId)

		// get all verticallty-compatbile neighbors to the unit
		.flatMap(unit => {
			const {spawning} = agent.archetype(unit.kind)
			const neighbors = getCardinalNeighbors(agent, unit.place)
			return (spawning)
				? neighbors.filter(neighbor => isVerticallyCompatible(
					spawning.verticality,
					agent.tiles.at(unit.place),
					agent.tiles.at(neighbor),
				))
				: []
		})

		// filter for vacancies
		.filter(neighbor => !agent.units.at(neighbor))

		// is the place a valid spawnpoint
		.some(v => vec2.equal(v, place))
}

