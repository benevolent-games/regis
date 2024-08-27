
import {Agent} from "../agent.js"
import {mintId} from "../../tools/mint-id.js"
import {Choice, ChoiceKind} from "../state.js"
import {UnitFreedom} from "./aspects/unit-freedom.js"
import {calculateMovement} from "./aspects/moving.js"
import {isValidSpawnPlace} from "./aspects/spawning.js"
import {canAfford, subtractResources} from "./aspects/money.js"
import {TurnTracker} from "../../terminal/parts/turn-tracker.js"
import {applyDamage, attackReport} from "./aspects/attack-report.js"

export class Proposer {
	unitFreedom = new UnitFreedom()

	constructor(
		private agent: Agent,
		private turnTracker: TurnTracker,
	) {}

	#rerender() {
		this.agent.stateRef.publish()
	}

	choosers = {
		spawn: (choice: Choice.Spawn) => {
			const {agent, turnTracker} = this
			const {config} = agent.state.initial
			const {cost} = config.unitArchetypes[choice.unitKind]
			const myTeam = turnTracker.ourTurn
			const buyable = cost !== null
			const affordable = canAfford(agent.currentTeam, cost)
			const valid = isValidSpawnPlace(agent, agent.currentTurn, choice.place)
			const howManyAlready = [...agent.units.list()]
				.filter(unit => unit.team === agent.currentTurn)
				.filter(unit => unit.kind === choice.unitKind)
				.length
			const {roster} = config.teams.at(agent.currentTurn)!
			const remainingRosterCount = roster[choice.unitKind] - howManyAlready
			const availableInRoster = remainingRosterCount > 0
			return (myTeam && buyable && affordable && availableInRoster && valid)
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
			const {agent, unitFreedom, turnTracker} = this
			const teamId = this.agent.currentTurn
			const calculation = calculateMovement({
				agent,
				teamId,
				source: choice.source,
				target: choice.target,
			})

			if (!turnTracker.ourTurn)
				return null

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
			const {agent, unitFreedom, turnTracker} = this
			const report = attackReport(agent, agent.currentTurn, choice)
			if (report) {
				if (!unitFreedom.hasFreedom(report.sourceUnit.id))
					return null

				if (!turnTracker.ourTurn)
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

