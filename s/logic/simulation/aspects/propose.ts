
import {Agent} from "../../agent.js"
import {UnitFreedom} from "./unit-freedom.js"
import {calculateMovement} from "./moving.js"
import {isValidSpawnPlace} from "./spawning.js"
import {mintId} from "../../../tools/mint-id.js"
import {Choice, ChoiceKind} from "../../state.js"
import {canAfford, subtractResources} from "./money.js"
import {applyDamage, attackReport} from "./attack-report.js"

export class Proposer {
	unitFreedom = new UnitFreedom()

	constructor(private agent: Agent) {}

	#rerender() {
		this.agent.stateRef.publish()
	}

	choosers = {
		spawn: (choice: Choice.Spawn) => {
			const {agent} = this
			const {cost} = agent.state.initial.config.unitArchetypes[choice.unitKind]
			const buyable = cost !== null
			const affordable = canAfford(agent.currentTeam, cost)
			const valid = isValidSpawnPlace(agent, agent.currentTurn, choice.place)
			return (buyable && affordable && valid)
				? {
					commit: () => {
						subtractResources(agent.state, agent.currentTurn, cost)
						const id = mintId()
						this.unitFreedom.revokeFreedom(id)
						agent.units.add({
							id,
							kind: choice.unitKind,
							place: choice.place,
							team: agent.currentTurn,
							damage: 0,
						})
						this.#rerender()
					},
				}
				: null
		},

		movement: (choice: Choice.Movement) => {
			const {agent, unitFreedom} = this
			const teamId = this.agent.currentTurn
			const calculation = calculateMovement({
				agent,
				teamId,
				source: choice.source,
				target: choice.target,
			})

			if (!calculation)
				return null

			if (!unitFreedom.hasFreedom(calculation.unit.id))
				return null

			return {
				...choice,
				...calculation,
				commit: () => {
					unitFreedom.revokeFreedom(calculation.unit.id)
					calculation.unit.place = choice.target
					this.#rerender()
				},
			}
		},

		attack: (choice: Choice.Attack) => {
			const {agent, unitFreedom} = this
			const report = attackReport(agent, agent.currentTurn, choice)
			if (report) {
				if (!unitFreedom.hasFreedom(report.sourceUnit.id))
					return null
				return {
					...report,
					commit: () => {
						const {targetUnit, attack} = report
						unitFreedom.revokeFreedom(report.sourceUnit.id)
						const lethal = applyDamage(agent, targetUnit, attack.damage)
						if (lethal)
							agent.deleteUnit(targetUnit.id)
					},
				}
			}
			return null
		},

		investment: (choice: Choice.Investment) => {
			return null
			// return {
			// 	commit() {},
			// }
		},
	} satisfies Record<ChoiceKind, any>
}

