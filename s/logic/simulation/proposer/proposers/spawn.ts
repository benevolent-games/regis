
import {is} from "@benev/slate"
import {proposerFn} from "../types.js"
import {Choice, Claim} from "../../../state.js"
import {isValidSpawnPlace} from "../../aspects/spawning.js"
import {boardCoords} from "../../../../tools/board-coords.js"
import {canAfford, subtractResources} from "../../aspects/money.js"
import {GameOverDenial, SpawnDenial, WrongTeamDenial} from "../../aspects/denials.js"

export const proposeSpawn = proposerFn(
	({agent, freedom, turnTracker}) =>
	(choice: Choice.Spawn) => {

	const {unitKind} = choice
	const {config} = agent.state.initial
	const {recruitable, stakeholder} = config.archetypes[unitKind]
	const teamId = agent.activeTeamId

	const stakingCost = stakeholder
		? agent.claims.getStakingCost(choice.place)
		: 0

	const tech = agent.claims.getTech(teamId)

	const validPlace = isValidSpawnPlace(agent, teamId, choice.place)
	const howManyAlready = [...agent.units.list()]
		.filter(unit => unit.team === teamId)
		.filter(unit => unit.kind === choice.unitKind)
		.length

	if (unitKind in tech && !tech[unitKind as keyof Claim.Tech])
		return new SpawnDenial(`unit kind "${unitKind}" is not unlocked`)

	if (!recruitable)
		return new SpawnDenial(`unit kind "${unitKind}" is not for sale`)

	const cost = recruitable.cost + stakingCost
	const affordable = canAfford(agent.activeTeam, cost)
	const availableInRoster = is.available(recruitable.limit)
		? (recruitable.limit - howManyAlready) > 0
		: true

	if (!affordable)
		return new SpawnDenial(`cannot afford "${unitKind}" at cost of ${cost}`)

	if (!availableInRoster)
		return new SpawnDenial(`"${unitKind}" not available in roster`)

	if (!validPlace)
		return new SpawnDenial(`invalid spawn place ${boardCoords(choice.place)}`)

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

