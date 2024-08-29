
import {proposerFn} from "../types.js"
import {Choice} from "../../../state.js"
import {mintId} from "../../../../tools/mint-id.js"
import {isValidSpawnPlace} from "../../aspects/spawning.js"
import {boardCoords} from "../../../../tools/board-coords.js"
import {canAfford, subtractResources} from "../../aspects/money.js"
import {GameOverDenial, SpawnDenial, WrongTeamDenial} from "../../aspects/denials.js"

export const proposeSpawn = proposerFn(
	({agent, freedom, turnTracker}) =>
	(choice: Choice.Spawn) => {

	const {unitKind} = choice
	const {config} = agent.state.initial
	const {cost} = config.unitArchetypes[unitKind]

	const buyable = cost !== null
	const affordable = canAfford(agent.activeTeam, cost)
	const validPlace = isValidSpawnPlace(agent, agent.activeTeamIndex, choice.place)

	const howManyAlready = [...agent.units.list()]
		.filter(unit => unit.team === agent.activeTeamIndex)
		.filter(unit => unit.kind === choice.unitKind)
		.length

	const {roster} = config.teams.at(agent.activeTeamIndex)!
	const remainingRosterCount = roster[choice.unitKind] - howManyAlready
	const availableInRoster = remainingRosterCount > 0

	if (!buyable)
		return new SpawnDenial(`unit kind "${unitKind}" is not for sale`)

	if (!affordable)
		return new SpawnDenial(`cannot afford "${unitKind}"`)

	if (!availableInRoster)
		return new SpawnDenial(`"${unitKind}" not available in roster`)

	if (!validPlace)
		return new SpawnDenial(`invalid spawn place ${boardCoords(choice.place)}`)

	if (!turnTracker.ourTurn)
		return new WrongTeamDenial()

	if (agent.conclusion)
		return new GameOverDenial()

	return () => {
		subtractResources(agent.state, agent.activeTeamIndex, cost)
		const id = mintId()
		freedom.countSpawning(id)
		agent.units.add({
			id,
			kind: choice.unitKind,
			place: choice.place,
			team: agent.activeTeamIndex,
			damage: 0,
		})
	}
})

