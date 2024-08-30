
import {vec2, Vec2} from "@benev/toolbox"
import {Agent} from "../../agent.js"
import {getNearby} from "./navigation.js"
import {AgentState} from "../../state.js"
import {isVerticallyCompatible} from "./verticality.js"

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
		const {vision} = agent.archetype(unit.kind)

		if (isFriendly) {
			add(unit.place)

			if (vision) {
				const unitTile = agent.tiles.at(unit.place)

				getNearby(agent, unit.place, vision.range)
					.filter(({tile}) => isVerticallyCompatible(vision.verticality, unitTile, tile))
					.forEach(({place}) => add(place))
			}
		}
	}

	for (const {place, claim: {watchtower}} of agent.claims.getStakedClaims(teamId)) {
		if (watchtower) {
			const watchtowerTile = agent.tiles.at(place)
			getNearby(agent, place, watchtower.range)
				.filter(({tile}) => isVerticallyCompatible(watchtower.verticality, watchtowerTile, tile))
				.forEach(({place}) => add(place))
		}
	}

	return visionArray
}

