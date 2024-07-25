
import {Vec2} from "@benev/toolbox"
import {Agent} from "../../agent.js"
import {getNearby} from "./navigation.js"
import {ArbiterState} from "../../state.js"
import {isVerticallyCompatible} from "./verticality.js"

//
// vision is related to fog-of-war
//

export function visionForTeam(state: ArbiterState, teamId: number) {
	const agent = new Agent(state)
	const visionArray: Vec2[] = []

	function add(place: Vec2) {
		if (!visionArray.includes(place))
			visionArray.push(place)
	}

	for (const unit of agent.units.list()) {
		const isFriendly = unit.team === teamId
		const {vision} = agent.archetype(unit.kind)

		if (isFriendly && vision) {
			const unitTile = agent.tiles.at(unit.place)
			getNearby(agent, unit.place, vision.range)
				.filter(({tile}) => isVerticallyCompatible(vision.verticality, unitTile, tile))
				.forEach(({place}) => add(place))
		}
	}

	return visionArray
}

