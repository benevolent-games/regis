
import {Vec2, vec2} from "@benev/toolbox"

import {TilesHelper} from "./tiles.js"
import {UnitsHelper} from "./units.js"
import {AgentState, Claim, TechKind, TileClaim} from "../state.js"

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

	getStakingCost(place: Vec2) {
		const {initial: {config}} = this.state
		const {claim} = this.tiles.at(place)
		let cost = 0

		if (claim.tech)
			for (const [key, value] of Object.entries(claim.tech))
				if (value)
					cost += config.costs.staking.tech[key as TechKind]

		if (claim.resource)
			cost += config.costs.staking.resource

		if (claim.watchtower)
			cost += config.costs.staking.watchtower

		return cost
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
			queen: false,
		}

		for (const {claim} of this.getStakedClaims(teamIndex)) {
			if (!claim.tech)
				continue
			for (const [key, value] of Object.entries(claim.tech)) {
				if (value)
					tech[key as TechKind] = true
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

