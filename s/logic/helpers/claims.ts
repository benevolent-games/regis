
import {Vec2} from "@benev/toolbox"

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

		if (claim.resource) {
			const level = claim.resource.level
			cost += config.costs.staking.resources[level - 1]
		}

		if (claim.specialResource)
			cost += config.costs.staking.specialResource

		if (claim.watchtower)
			cost += config.costs.staking.watchtower

		return cost
	}

	getClaimIncome({resource, specialResource}: TileClaim) {
		const {config} = this.state.initial
		
		const extractors: (() => void)[] = []
		let income = 0

		const extract = (container: {stockpile: number}, take: number) => {
			const remaining = Math.max(0, container.stockpile - take)
			const taken = container.stockpile - remaining
			income += taken
			extractors.push(() => { container.stockpile = remaining })
		}

		if (resource) {
			extract(resource, resource.level * config.resourceValue)
		}

		if (specialResource) {
			extract(specialResource, config.specialResourceValue)
		}

		const commitExtraction = () => extractors.forEach(fn => fn())
		return {income, commitExtraction}
	}

	getStakedClaims(teamId: number) {
		const {tiles} = this

		return Array.from(tiles.list())
			.map(({place, tile}) => {
				if (!tile.claim)
					return null

				const stakeholder = this.getStakeholder(place)
				if (!stakeholder)
					return null

				if (stakeholder.team !== teamId)
					return null

				return {
					place,
					stakeholder,
					claim: tile.claim,
				}
			})
			.filter(c => !!c)
	}

	getTech(teamId: number) {
		const tech: Claim.Tech = {
			knight: false,
			rook: false,
			bishop: false,
			queen: false,
			elephant: false,
		}

		for (const {claim} of this.getStakedClaims(teamId)) {
			if (!claim.tech)
				continue
			for (const [key, value] of Object.entries(claim.tech)) {
				if (value)
					tech[key as TechKind] = true
			}
		}

		return tech
	}

	getTeamIncome(teamId: number) {
		const {config} = this.state.initial

		let totalIncome = config.universalBasicIncome
		const extractors: (() => void)[] = []

		for (const {claim} of this.getStakedClaims(teamId)) {
			if (!claim.resource)
				continue

			const {income, commitExtraction} = this.getClaimIncome(claim)
			totalIncome += income
			extractors.push(commitExtraction)
		}

		const commitExtraction = () => extractors.forEach(fn => fn())
		return {income: totalIncome, commitExtraction}
	}
}

