
import {Agent} from "../../agent.js"
import {Choice, Unit} from "../../state.js"
import {isWithinRange} from "./navigation.js"
import {isVerticallyCompatible} from "./verticality.js"

export function attackReport(
		agent: Agent,
		choice: Choice.Attack,
	) {

	const victim = agent.units.get(choice.victimId)
	if (!victim)
		return null

	const attacker = agent.units.get(choice.attackerId)
	if (!attacker)
		return null

	const hostile = attacker.team !== victim.team
	if (!hostile)
		return null

	const {armed} = agent.archetype(attacker.kind)
	if (!armed)
		return null

	if (!isWithinRange(armed.range, attacker.place, victim.place))
		return null

	if (!isVerticallyCompatible(
			armed.verticality,
			agent.tiles.at(attacker.place),
			agent.tiles.at(victim.place),
		))
		return null

	return {armed, attacker, victim}
}

export function applyDamage(agent: Agent, unit: Unit, damage: number) {
	unit.damage += damage
	const {mortal} = agent.archetype(unit.kind)
	return isLethal(mortal?.health, unit.damage)
}

function isLethal(health: number | undefined, damage: number) {
	return health === undefined
		? false
		: (health - damage) <= 0
}

