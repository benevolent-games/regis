
import {Agent} from "../../agent.js"
import {AttackDenial} from "./denials.js"
import {Choice, Unit} from "../../state.js"
import {isWithinRange} from "./navigation.js"
import {isVerticallyCompatible} from "./verticality.js"
import {boardCoords} from "../../../tools/board-coords.js"

export function attackReport(
		agent: Agent,
		teamId: number,
		{source, target}: Choice.Attack,
	) {

	const sourceUnit = agent.units.at(source)
	if (!sourceUnit)
		return new AttackDenial(`no source unit at ${boardCoords(source)}`)

	const targetUnit = agent.units.at(target)
	if (!targetUnit)
		return new AttackDenial(`no target unit at ${boardCoords(target)}`)

	const sourceIsFriendly = sourceUnit.team === teamId
	if (!sourceIsFriendly)
		return new AttackDenial(`source unit is not friendly`)

	const targetIsEnemy = targetUnit.team !== teamId
	if (!targetIsEnemy)
		return new AttackDenial(`target unit is not an enemy`)

	const {attack} = agent.archetype(sourceUnit.kind)
	if (!attack)
		return new AttackDenial(`unit archetype "${sourceUnit.kind}" not configured with attack capability`)

	if (!isWithinRange(attack.range, source, target))
		return new AttackDenial(`out of range`)

	if (!isVerticallyCompatible(
			attack.verticality,
			agent.tiles.at(source),
			agent.tiles.at(target),
		))
		return new AttackDenial(`not vertically allowable`)

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

