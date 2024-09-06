
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

	const {armed} = agent.archetype(attacker.kind)
	if (!armed)
		return new AttackDenial(`unit archetype "${attacker.kind}" not configured with attack capability`)

	if (!isWithinRange(armed.range, attacker.place, victim.place))
		return new AttackDenial(`out of range`)

	if (!isVerticallyCompatible(
			armed.verticality,
			agent.tiles.at(attacker.place),
			agent.tiles.at(victim.place),
		))
		return new AttackDenial(`not vertically allowable`)

	return {
		armed,
		attacker,
		victim,
	}
}

// // TODO delete if obsolete
// export function isChoiceLethal(agent: Agent, choice: Choice.Attack) {
// 	const attacker = agent.units.requireGet(choice.attackerId)
// 	const victim = agent.units.requireGet(choice.victimId)
// 	const {mortal} = agent.archetype(victim.kind)
// 	const {armed} = agent.archetype(attacker.kind)
// 	return isLethal(health, victim.damage + (attack?.damage ?? 0))
// }

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

