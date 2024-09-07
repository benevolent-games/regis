
import {Vec2} from "@benev/toolbox"

import {Agent} from "../../agent.js"
import {Rebuke} from "../../activities/types.js"
import {Choice, Turn, Unit} from "../../state.js"
import {Activities} from "../../activities/activities.js"
import {isWithinRange, manhattanDistance} from "../aspects/navigation.js"

export function autoAttacks(agent: Agent, activities: Activities, turn: Turn) {
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

			const judgement = activities.judge(choice)
			const valid = !(judgement instanceof Rebuke)

			if (valid) {
				autoChoices.push(choice)
				judgement.commit()
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

