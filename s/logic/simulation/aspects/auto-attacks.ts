
import {Vec2} from "@benev/toolbox"

import {Denial} from "./denials.js"
import {Agent} from "../../agent.js"
import {Choice, Turn, Unit} from "../../state.js"
import {Proposers} from "../proposer/make-proposers.js"
import {isWithinRange, manhattanDistance} from "../aspects/navigation.js"

export function autoAttacks(agent: Agent, proposers: Proposers, turn: Turn) {
	const myTeam = agent.activeTeamId
	const myUnits = [...agent.units.list()]
		.filter(unit => unit.team === myTeam)

	const alreadyAttacked = new Set<number>()

	for (const choice of turn.choices) {
		if (choice.kind === "attack")
			alreadyAttacked.add(choice.attackerId)
	}

	const autoChoices: Choice.Attack[] = []

	for (const attacker of myUnits) {
		const archetype = agent.archetype(attacker.kind)

		if (archetype.armed && !alreadyAttacked.has(attacker.id)) {
			const {range} = archetype.armed

			const enemyUnits = findEnemyUnits(agent, myTeam)
			const enemiesNearby = [...enemyUnits]
				.filter(enemy => isWithinRange(range, attacker.place, enemy.place))

			const victim = nearest(attacker.place, enemiesNearby)
			if (!victim)
				continue

			const choice: Choice.Attack = {
				kind: "attack",
				attackerId: attacker.id,
				victimId: victim.id,
			}

			const proposal = proposers.attack(choice)
			const valid = !(proposal instanceof Denial)

			if (valid) {
				autoChoices.push(choice)
				proposal()
			}
		}
	}

	return autoChoices
}

function findEnemyUnits(agent: Agent, teamId: number) {
	return [...agent.units.list()].filter(unit => (

		// we don't want neutral units (like obstacles)
		unit.team !== null &&

		// and we don't want friendly units
		unit.team !== teamId
	))
}

function nearest(place: Vec2, units: Unit[]) {
	let best: {unit: Unit, distance: number} | null = null

	for (const unit of units) {
		const distance = manhattanDistance(place, unit.place)
		if (best) {
			if (distance < best.distance)
				best = {unit, distance}
		}
		else
			best = {unit, distance}
	}

	return best?.unit ?? null
}

