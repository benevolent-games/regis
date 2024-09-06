
import {is} from "@benev/slate"
import {proposerFn} from "../types.js"
import {Choice} from "../../../state.js"
import {boardCoords} from "../../../../tools/board-coords.js"
import {isValidRecruitmentPlace} from "../../aspects/recruiting.js"
import {canAfford, subtractResources} from "../../aspects/money.js"
import {GameOverDenial, RecruitDenial, WrongTeamDenial} from "../../aspects/denials.js"

export const proposeRecruit = proposerFn(
	({agent, freedom, turnTracker}) =>
	(choice: Choice.Recruit) => {

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
		return new RecruitDenial(`unit kind "${unitKind}" is not unlocked`)

	if (!recruitable)
		return new RecruitDenial(`unit kind "${unitKind}" is not for sale`)

	const cost = recruitable.cost + stakingCost
	const affordable = canAfford(agent.activeTeam, cost)
	const availableInRoster = is.available(recruitable.limit)
		? (recruitable.limit - howManyAlready) > 0
		: true

	if (!affordable)
		return new RecruitDenial(`cannot afford "${unitKind}" at cost of ${cost}`)

	if (!availableInRoster)
		return new RecruitDenial(`"${unitKind}" not available in roster`)

	if (!validPlace)
		return new RecruitDenial(`invalid spawn place ${boardCoords(choice.place)}`)

	if (!turnTracker.ourTurn)
		return new WrongTeamDenial()

	if (agent.conclusion)
		return new GameOverDenial()

	return () => {
		subtractResources(agent.state, teamId, cost)
		const id = agent.grabId()
		freedom.recordTask(id, {kind: "spawned"})
		agent.units.add({
			id,
			kind: choice.unitKind,
			place: choice.place,
			team: teamId,
			damage: 0,
		})
	}
})

