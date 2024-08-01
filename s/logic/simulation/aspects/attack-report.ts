
import {Agent} from "../../agent.js"
import {Choice, Unit} from "../../state.js"
import {isWithinRange} from "./navigation.js"
import {isVerticallyCompatible} from "./verticality.js"

export function attackReport(
		agent: Agent,
		teamId: number,
		{source, target}: Choice.Attack,
	) {

	const sourceUnit = agent.units.at(source)
	const targetUnit = agent.units.at(target)
	if (!sourceUnit || !targetUnit)
		return null

	const sourceIsFriendly = sourceUnit.team === teamId
	const targetIsEnemy = targetUnit.team !== teamId

	if (!sourceIsFriendly || !targetIsEnemy)
		return null

	const {attack} = agent.archetype(sourceUnit.kind)
	if (!attack)
		return null

	if (!isWithinRange(attack.range, source, target))
		return null

	if (!isVerticallyCompatible(
			attack.verticality,
			agent.tiles.at(source),
			agent.tiles.at(target),
		))
		return null

	return {
		attack,
		sourceUnit,
		targetUnit,
		isKill: wouldThisBeLethal(agent, targetUnit, attack.damage),
	}
}

export function wouldThisBeLethal(
		agent: Agent,
		unit: Unit,
		additionallyProposedDamage: number,
	) {
	const {health} = agent.archetype(unit.kind)
	return isLethal(health, unit.damage - additionallyProposedDamage)
}

export function applyDamage(agent: Agent, unit: Unit, damage: number) {
	unit.damage += damage
	const {health} = agent.archetype(unit.kind)
	return isLethal(health, unit.damage)
}

function isLethal(health: null | number, damage: number) {
	return health === null
		? false
		: (health - damage) <= 0
}

