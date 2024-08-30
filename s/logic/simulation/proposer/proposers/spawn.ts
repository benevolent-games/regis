
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
	const {cost: unitCost} = config.unitArchetypes[unitKind]
	const stakingCost = agent.claims.getStakingCost(choice.place)
	const teamIndex = agent.activeTeamIndex

	const buyable = unitCost !== null
	const tech = agent.claims.getTech(teamIndex)

	const validPlace = isValidSpawnPlace(agent, teamIndex, choice.place)
	const howManyAlready = [...agent.units.list()]
		.filter(unit => unit.team === teamIndex)
		.filter(unit => unit.kind === choice.unitKind)
		.length
	const {roster} = config.teams.at(teamIndex)!
	const remainingRosterCount = roster[choice.unitKind] - howManyAlready
	const availableInRoster = remainingRosterCount > 0

	if (unitKind in tech && !tech[unitKind as keyof Claim.Tech])
		return new SpawnDenial(`unit kind "${unitKind}" is not unlocked`)

	if (!buyable)
		return new SpawnDenial(`unit kind "${unitKind}" is not for sale`)

	const cost = unitCost + stakingCost
	const affordable = canAfford(agent.activeTeam, cost)

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
		subtractResources(agent.state, teamIndex, cost)
		const id = agent.grabId()
		freedom.countSpawning(id)
		agent.units.add({
			id,
			kind: choice.unitKind,
			place: choice.place,
			team: teamIndex,
			damage: 0,
		})
	}
})

