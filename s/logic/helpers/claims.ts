
import {Vec2, vec2} from "@benev/toolbox"

import {TilesHelper} from "./tiles.js"
import {UnitsHelper} from "./units.js"
import {AgentState, Claim, TileClaim} from "../state.js"

export class ClaimsHelper {
	constructor(
		private state: AgentState,
		private tiles: TilesHelper,
		private units: UnitsHelper,
	) {}

	getStakeholder(place: Vec2) {
		const {state, units} = this

		const unit = units.at(place)
		if (!unit)
			return null

		const {stakeholder} = state.initial.config.unitArchetypes[unit.kind]
		if (!stakeholder)
			return null

		return unit
	}

	determineResourceClaimLevel(place: Vec2, resource: Claim.Resource) {
		const investment = this.state.investments.find(i => vec2.equal(i.place, place))
		return resource.startingLevel + (investment?.count ?? 0)
	}

	getStakedClaims(teamIndex: number) {
		const {tiles} = this

		return Array.from(tiles.list())
			.map(({place, tile}) => {
				if (!tile.claim)
					return null

				const stakeholder = this.getStakeholder(place)
				if (!stakeholder)
					return null

				if (stakeholder.team !== teamIndex)
					return null

				return {
					place,
					stakeholder,
					claim: tile.claim,
				}
			})
			.filter(c => !!c)
	}

	getTech(teamIndex: number) {
		const tech: Claim.Tech = {
			knight: false,
			rook: false,
			bishop: false,

			// TODO unhack this
			queen: true,
		}

		for (const {claim} of this.getStakedClaims(teamIndex)) {
			if (!claim.tech)
				continue
			for (const [key, value] of Object.entries(claim.tech)) {
				if (value)
					tech[key as keyof Claim.Tech] = true
			}
		}

		return tech
	}

	getIncome(teamIndex: number) {
		const {state} = this
		let income = state.initial.config.universalBasicIncome

		for (const {claim, place} of this.getStakedClaims(teamIndex)) {
			if (!claim.resource)
				continue

			const level = this.determineResourceClaimLevel(place, claim.resource)
			income += level
		}

		return income
	}
}

