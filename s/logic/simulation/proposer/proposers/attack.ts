
import {proposerFn} from "../types.js"
import {Choice} from "../../../state.js"
import {boardCoords} from "../../../../tools/board-coords.js"
import {applyDamage, attackReport} from "../../aspects/attack-report.js"
import {Denial, GameOverDenial, MovementDenial, WrongTeamDenial} from "../../aspects/denials.js"

export const proposeAttack = proposerFn(
	({agent, freedom, chalkboard, turnTracker}) =>
	(choice: Choice.Attack) => {

	const report = attackReport(agent, choice)
	if (report instanceof Denial)
		return report

	const {attack, victim, attacker} = report
	const archetype = agent.archetype(attacker.kind)

	const freequery = freedom.query(attacker.id, archetype)
	if (!freequery?.canAttack(victim.id))
		return new MovementDenial(`unit "${attacker.kind}" at ${boardCoords(attacker.place)} does not have freedom to attack`)

	if (!turnTracker.ourTurn || turnTracker.teamId !== attacker.team)
		return new WrongTeamDenial()

	if (agent.conclusion)
		return new GameOverDenial()

	return () => {
		freedom.recordTask(attacker.id, {kind: "attack", targetId: victim.id})
		const lethal = applyDamage(agent, victim, attack.damage)
		if (lethal)
			agent.deleteUnit(victim.id)
		if (victim.team !== null)
			chalkboard.reveal(attacker.place)
	}
})

