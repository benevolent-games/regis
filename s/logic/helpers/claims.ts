
import {Vec2} from "@benev/toolbox"

import {TilesHelper} from "./tiles.js"
import {UnitsHelper} from "./units.js"
import {AgentState, Claim} from "../state.js"
import {UnitKind} from "../../config/units.js"

export class ClaimsHelper {
	constructor(
		private state: AgentState,
		private tiles: TilesHelper,
		private units: UnitsHelper,
	) {}

	stakeholderAt(place: Vec2) {
		const {state, units} = this

		const unit = units.at(place)
		if (!unit)
			return null

		const {stakeholder} = state.initial.config.archetypes[unit.kind]
		if (!stakeholder)
			return null

		return unit
	}

	stakingCost(claims: Claim.Any[]) {
		const {initial: {config}} = this.state
		let cost = 0

		for (const claim of claims) {
			switch (claim.kind) {
				case "resource": {
					const {stakeCost} = config.resources.mining.resource.at(claim.level)!
					cost += stakeCost
					break
				}
				case "specialResource": {
					cost += config.resources.mining.specialResource.stakeCost
					break
				}
				case "watchtower": {
					cost += config.watchtowers.stakeCost
					break
				}
				case "tech": {
					const {recruitable} = config.archetypes[claim.unlock]
					cost += recruitable?.unlockable?.price ?? 0
					break
				}
			}
		}

		return cost
	}

	watchtower(claims: Claim.Any[]) {
		return claims.find(c => c.kind === "watchtower")
	}

	stock(claims: Claim.Any[]) {
		return claims
			.filter(c => c.kind === "resource" || c.kind === "specialResource")
			.reduce((stock, claim) => stock + claim.stockpile, 0)
	}

	income(claims: Claim.Any[]) {
		const {config} = this.state.initial

		// we'll accumulate the total income here
		let income = 0

		// we can optionally call `commitExtraction` to actually remove the income
		// from the relevant claim stockpiles.
		const extractors: (() => void)[] = []
		const removeFromStockpiles = () => extractors.forEach(fn => fn())

		// this function accumulates `income` and adds an extractor function
		const evaluate = (container: {stockpile: number}, take: number) => {
			const remaining = Math.max(0, container.stockpile - take)
			const taken = container.stockpile - remaining
			income += taken
			extractors.push(() => { container.stockpile = remaining })
		}

		for (const claim of claims) {
			switch (claim.kind) {
				case "resource": {
					const resource = config.resources.mining.resource.at(claim.level)!
					evaluate(claim, resource.revenue)
					break
				}
				case "specialResource": {
					const resource = config.resources.mining.resource.at(claim.stockpile)!
					evaluate(claim, resource.revenue)
					break
				}
			}
		}

		return {income, removeFromStockpiles}
	}

	teamStakes(teamId: number) {
		return [...this.tiles.list()].filter(({place}) => {
			const stakeholder = this.stakeholderAt(place)
			return (stakeholder && stakeholder.team === teamId)
		})
	}

	teamStakedClaims(teamId: number) {
		return this.teamStakes(teamId).flatMap(r => r.tile.claims)
	}

	tech(claims: Claim.Any[]) {
		const tech = new Set<UnitKind>()

		for (const claim of claims)
			if (claim.kind === "tech")
				tech.add(claim.unlock)

		return tech
	}

	teamTech(teamId: number) {
		return this.tech(this.teamStakedClaims(teamId))
	}

	teamIncome(teamId: number) {
		const {config} = this.state.initial
		const {universalBasicIncome} = config.resources
		const {income, removeFromStockpiles} = this.income(this.teamStakedClaims(teamId))
		return {
			income: universalBasicIncome + income,
			removeFromStockpiles,
		}
	}
}

