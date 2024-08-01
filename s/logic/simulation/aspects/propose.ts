
import {mapGuarantee} from "@benev/slate"

import {Agent} from "../../agent.js"
import {calculateMovement} from "./moving.js"
import {isValidSpawnPlace} from "./spawning.js"
import {mintId} from "../../../tools/mint-id.js"
import {Choice, ChoiceKind} from "../../state.js"
import {canAfford, subtractResources} from "./money.js"
import {applyDamage, attackReport} from "./attack-report.js"

export type Proposition = ReturnType<typeof propose>

export function propose(agent: Agent) {
	const teamId = agent.state.context.currentTurn
	const unitFreedom = new UnitFreedom()
	const rerender = () => agent.stateRef.publish()
	return ({

		spawn(choice: Choice.Spawn) {
			const {cost} = agent.state.initial.config.unitArchetypes[choice.unitKind]
			const buyable = cost !== null
			const affordable = canAfford(agent.currentTeam, cost)
			const valid = isValidSpawnPlace(agent, teamId, choice.place)
			return (buyable && affordable && valid)
				? {
					commit() {
						subtractResources(agent.state, teamId, cost)
						const id = mintId()
						unitFreedom.revokeFreedom(id)
						agent.units.add({
							id,
							kind: choice.unitKind,
							place: choice.place,
							team: teamId,
							damage: 0,
						})
						rerender()
					},
				}
				: null
		},

		movement(choice: Choice.Movement) {
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
				commit() {
					unitFreedom.revokeFreedom(calculation.unit.id)
					calculation.unit.place = choice.target
					rerender()
				},
			}
		},

		attack(choice: Choice.Attack) {
			const report = attackReport(agent, teamId, choice)
			if (report) {
				if (!unitFreedom.hasFreedom(report.sourceUnit.id))
					return null
				return {
					...report,
					commit() {
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

		investment(choice: Choice.Investment) {
			return null
			// return {
			// 	commit() {},
			// }
		},
	}) satisfies Record<ChoiceKind, any>
}

////////////////////////////////////////////////
////////////////////////////////////////////////

class UnitFreedom {
	#map = new Map<string, {freedom: boolean}>()

	#obtain(id: string) {
		return mapGuarantee(this.#map, id, () => ({freedom: true}))
	}

	hasFreedom(id: string) {
		return this.#obtain(id).freedom
	}

	revokeFreedom(id: string) {
		this.#obtain(id).freedom = false
	}
}

