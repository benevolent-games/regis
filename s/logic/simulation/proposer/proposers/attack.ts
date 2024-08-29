
import {proposerFn} from "../types.js"
import {Choice} from "../../../state.js"
import {boardCoords} from "../../../../tools/board-coords.js"
import {applyDamage, attackReport} from "../../aspects/attack-report.js"
import {Denial, MovementDenial, WrongTeamDenial} from "../../aspects/denials.js"

export const proposeAttack = proposerFn(
	({agent, freedom, turnTracker}) =>
	(choice: Choice.Attack) => {

	const report = attackReport(agent, choice)
	if (report instanceof Denial)
		return report

	const archetype = agent.archetype(report.sourceUnit.kind)

	const {canAttack} = freedom.report(report.sourceUnit.id, archetype)
	if (!canAttack)
		return new MovementDenial(`unit "${report.sourceUnit.kind}" at ${boardCoords(choice.source)} does not have freedom to attack`)

	if (!turnTracker.ourTurn || turnTracker.teamIndex !== report.sourceUnit.team)
		return new WrongTeamDenial()

	return () => {
		const {targetUnit, attack} = report
		freedom.countAttack(report.sourceUnit.id)
		const lethal = applyDamage(agent, targetUnit, attack.damage)
		if (lethal)
			agent.deleteUnit(targetUnit.id)
	}
})

