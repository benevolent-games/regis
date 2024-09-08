
import {is} from "@benev/slate"
import {Vec2} from "@benev/toolbox"
import {Choice} from "../../state.js"
import {UnitKind} from "../../../config/units.js"
import {Judgement, Proposal, Rebuke, SoftRebuke, activity} from "../types.js"
import {isValidRecruitmentPlace} from "../../simulation/aspects/recruiting.js"
import {canAfford, subtractResources} from "../../simulation/aspects/money.js"

export const recruit = activity<Choice.Recruit>()(({
		agent, unitTaskTracker, turnTracker,
	}) => ({

	propose: (place: Vec2, unitKind: UnitKind) => {
		return new Proposal({
			kind: "recruit",
			place,
			unitKind,
		})
	},

	judge: choice => {
		const {unitKind} = choice
		const {config} = agent.state.initial
		const {recruitable, stakeholder} = config.archetypes[unitKind]

		const teamId = agent.activeTeamId
		const tile = agent.tiles.at(choice.place)

		const stakingCost = stakeholder
			? agent.claims.stakingCost(tile.claims)
			: 0

		const tech = agent.claims.teamTech(teamId)

		const validPlace = isValidRecruitmentPlace(agent, teamId, choice.place)
		const howManyAlready = [...agent.units.list()]
			.filter(unit => unit.team === teamId)
			.filter(unit => unit.kind === choice.unitKind)
			.length

		if (!tech.has(unitKind))
			return new Rebuke()

		if (!recruitable)
			return new Rebuke()

		const cost = recruitable.cost + stakingCost
		const affordable = canAfford(agent.activeTeam, cost)
		const availableInRoster = is.available(recruitable.limit)
			? (recruitable.limit - howManyAlready) > 0
			: true

		if (!affordable)
			return new Rebuke()

		if (!availableInRoster)
			return new Rebuke()

		if (!validPlace)
			return new Rebuke()

		if (!turnTracker.ourTurn)
			return new SoftRebuke()

		if (agent.conclusion)
			return new SoftRebuke()

		return new Judgement(choice, () => {
			subtractResources(agent.state, teamId, cost)
			const id = agent.grabId()
			unitTaskTracker.recordTask(id, {kind: "spawned"})
			agent.units.add({
				id,
				kind: choice.unitKind,
				place: choice.place,
				team: teamId,
				damage: 0,
			})
		})
	},
}))

