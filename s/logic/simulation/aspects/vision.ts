
import {vec2, Vec2} from "@benev/toolbox"
import {Agent} from "../../agent.js"
import {getNearby} from "./navigation.js"
import {AgentState} from "../../state.js"
import {isVerticallyCompatible} from "./verticality.js"
import { Verticality } from "../../../config/units/traits.js"

//
// vision is related to fog-of-war
//

export function universalVision(state: AgentState) {
	const agent = new Agent(state)
	return [...agent.tiles.list()].map(t => t.place)
}

export function limitedVision(state: AgentState, teamId: number) {
	const agent = new Agent(state)

	const visionArray: Vec2[] = []

	function exists(place: Vec2) {
		return visionArray.some(p => vec2.equal(p, place))
	}

	function add(place: Vec2) {
		if (!exists(place))
			visionArray.push(place)
	}

	for (const unit of agent.units.list()) {
		const isFriendly = unit.team === teamId
		const {sighted} = agent.archetype(unit.kind)

		if (isFriendly) {
			add(unit.place)

			if (sighted) {
				const unitTile = agent.tiles.at(unit.place)

				getNearby(agent, unit.place, sighted.range)
					.filter(({tile}) => isVerticallyCompatible(sighted.verticality, unitTile, tile))
					.forEach(({place}) => add(place))
			}
		}
	}

	for (const {place, tile} of agent.claims.teamStakes(teamId)) {
		const watchtower = agent.claims.watchtower(tile.claims)
		if (watchtower) {
			const verticality: Verticality = {above: true, below: true}

			getNearby(agent, place, watchtower.range)
				.filter(target => isVerticallyCompatible(verticality, tile, target.tile))
				.forEach(target => add(target.place))
		}
	}

	return visionArray
}

