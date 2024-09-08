
import {Vec2} from "@benev/toolbox"

import {TilesHelper} from "./tiles.js"
import {UnitsHelper} from "./units.js"
import {AgentState, Claim} from "../state.js"
import {UnitKind} from "../../config/units.js"

export class ClaimsHelper {
	#alwaysUnlocked: UnitKind[] = []

	constructor(
			private state: AgentState,
			private tiles: TilesHelper,
			private units: UnitsHelper,
		) {

		for (const [unitKind, archetype] of Object.entries(state.initial.config.archetypes)) {
			const recruitable = archetype.recruitable
			const unlockable = archetype.recruitable?.unlockable
			if (recruitable && !unlockable)
				this.#alwaysUnlocked.push(unitKind as UnitKind)
		}
	}

	get #config() {
		return this.state.initial.config
	}

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
					const {stakeCost} = config.resources.mining.resource.at(claim.level - 1)!
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

	isResourceful(claims: Claim.Any[]) {
		return claims.some(c =>
			c.kind === "resource" ||
			c.kind === "specialResource"
		)
	}

	watchtower(claims: Claim.Any[]) {
		return claims.find(c => c.kind === "watchtower")
	}

	getResourceValues(claim: Claim.Resource | Claim.SpecialResource) {
		const {resources} = this.#config
		return (claim.kind === "resource")
			? resources.mining.resource.at(claim.level - 1)!
			: resources.mining.specialResource
	}

	initialStock(claim: Claim.Resource | Claim.SpecialResource) {
		const {resources} = this.#config
		return (claim.kind === "resource")
			? this.getResourceValues(claim).stock
			: resources.mining.specialResource.stock
	}

	stock(claims: Claim.Any[]) {
		return claims
			.filter(c => c.kind === "resource" || c.kind === "specialResource")
			.reduce((total, claim) => total + (this.initialStock(claim) - claim.stockTaken), 0)
	}

	income(claims: Claim.Any[]) {
		// we'll accumulate the total income here
		let income = 0

		// we can optionally call `commitExtraction` to actually remove the income
		// from the relevant claim stockpiles.
		const extractors: (() => void)[] = []
		const removeFromStockpiles = () => extractors.forEach(fn => fn())

		// this function accumulates `income` and adds an extractor function
		const evaluate = (claim: Claim.Resource | Claim.SpecialResource, take: number) => {
			const full = this.initialStock(claim)
			const proposed = Math.min(full, claim.stockTaken + take)
			const takeable = proposed - claim.stockTaken
			income += takeable
			extractors.push(() => { claim.stockTaken = proposed })
		}

		for (const claim of claims) {
			if (claim.kind === "resource" || claim.kind === "specialResource") {
				const resource = this.getResourceValues(claim)
				evaluate(claim, resource.revenue)
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
		const tech = this.tech(this.teamStakedClaims(teamId))

		for (const kind of this.#alwaysUnlocked)
			tech.add(kind)

		return tech
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

