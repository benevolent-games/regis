
import {Vec2, vec2} from "@benev/toolbox"

import {TilesHelper} from "./tiles.js"
import {UnitsHelper} from "./units.js"
import {AgentState, Claim} from "../state.js"

export class ClaimsHelper {
	constructor(
		private state: AgentState,
		private tiles: TilesHelper,
		private units: UnitsHelper,
	) {}

	determineResourceClaimLevel(place: Vec2, resource: Claim.Resource) {
		const investment = this.state.investments.find(i => vec2.equal(i.place, place))
		return resource.startingLevel + (investment?.count ?? 0)
	}

	getTeamIncomes() {
		const {state, tiles, units} = this

		return state.initial.config.teams.map((_, teamIndex) => {
			let income = state.initial.config.universalBasicIncome

			for (const {place, tile} of tiles.list()) {
				if (!tile.claim.resource)
					continue

				const unit = units.at(place)
				if (!(unit && unit.team === teamIndex))
					continue

				const {stakeholder} = state.initial.config.unitArchetypes[unit.kind]
				if (!stakeholder)
					continue

				const level = this.determineResourceClaimLevel(place, tile.claim.resource)
				income += level
			}

			return income
		})
	}
}

