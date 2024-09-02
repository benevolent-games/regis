
import {Agent} from "../../agent.js"
import {AttackDenial} from "./denials.js"
import {Choice, Unit} from "../../state.js"
import {isWithinRange} from "./navigation.js"
import {isVerticallyCompatible} from "./verticality.js"

export function attackReport(
		agent: Agent,
		choice: Choice.Attack,
	) {

	const victim = agent.units.get(choice.victimId)
	if (!victim)
		return new AttackDenial(`victim ${choice.victimId} not found`)

	const attacker = agent.units.get(choice.attackerId)
	if (!attacker) {
		console.log([...agent.units.list()])
		return new AttackDenial(`attacker ${choice.attackerId} not found`)
	}

	const hostile = attacker.team !== victim.team
	if (!hostile)
		return new AttackDenial(`friendly fire`)

	const {attack} = agent.archetype(attacker.kind)
	if (!attack)
		return new AttackDenial(`unit archetype "${attacker.kind}" not configured with attack capability`)

	if (!isWithinRange(attack.range, attacker.place, victim.place))
		return new AttackDenial(`out of range`)

	if (!isVerticallyCompatible(
			attack.verticality,
			agent.tiles.at(attacker.place),
			agent.tiles.at(victim.place),
		))
		return new AttackDenial(`not vertically allowable`)

	return {
		attack,
		attacker,
		victim,
		// isKill: wouldThisBeLethal(agent, victim, attack.damage),
	}
}

export function isChoiceLethal(agent: Agent, choice: Choice.Attack) {
	const attacker = agent.units.requireGet(choice.attackerId)
	const victim = agent.units.requireGet(choice.victimId)
	const {health} = agent.archetype(victim.kind)
	const {attack} = agent.archetype(attacker.kind)
	return isLethal(health, victim.damage + (attack?.damage ?? 0))
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

