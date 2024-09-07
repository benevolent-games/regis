
import {Vec2} from "@benev/toolbox"
import {Choice} from "../../state.js"
import {activity, Judgement, Proposal, Rebuke, SoftRebuke} from "../types.js"
import {applyDamage, attackReport} from "../../simulation/aspects/attack-report.js"

export const attack = activity<Choice.Attack>()(({
		agent, freedom, turnTracker, chalkboard,
	}) => ({

	propose: (source: Vec2, target: Vec2) => {
		const attacker = agent.units.at(source)
		const victim = agent.units.at(target)

		if (!attacker || !victim)
			return new Rebuke()

		return new Proposal({
			kind: "attack",
			attackerId: attacker.id,
			victimId: victim.id,
		})
	},

	judge: choice => {
		const report = attackReport(agent, choice)
		if (!report)
			return new Rebuke()

		const {armed, victim, attacker} = report
		const archetype = agent.archetype(attacker.kind)

		const freequery = freedom.query(attacker.id, archetype)
		const canAttack = freequery?.canAttack(victim.id)
		if (!canAttack)
			return new Rebuke()

		if (!turnTracker.ourTurn || turnTracker.teamId !== attacker.team)
			return new SoftRebuke()

		if (agent.conclusion)
			return new SoftRebuke()

		return new Judgement(choice, () => {
			freedom.recordTask(attacker.id, {kind: "attack", targetId: victim.id})
			const lethal = applyDamage(agent, victim, armed.damage)

			if (lethal)
				agent.deleteUnit(victim.id)

			if (victim.team !== null)
				chalkboard.reveal(attacker.place)
		})
	},
}))

