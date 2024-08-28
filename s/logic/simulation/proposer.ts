
import {Vec2} from "@benev/toolbox"

import {Agent} from "../agent.js"
import {mintId} from "../../tools/mint-id.js"
import {Choice, ChoiceKind} from "../state.js"
import {isValidStep} from "./aspects/navigation.js"
import {UnitFreedom2} from "./aspects/unit-freedom.js"
import {isValidSpawnPlace} from "./aspects/spawning.js"
import {canAfford, subtractResources} from "./aspects/money.js"
import {TurnTracker} from "../../terminal/parts/turn-tracker.js"
import {applyDamage, attackReport} from "./aspects/attack-report.js"

export class Proposer {
	unitFreedom = new UnitFreedom2()

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
						this.unitFreedom.countSpawning(id)
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

			if (!turnTracker.ourTurn)
				return null

			const unit = agent.units.at(choice.source)
			if (!unit)
				return null

			const archetype = agent.archetype(unit.kind)
			if (!archetype.move)
				return null

			const {canMove} = unitFreedom.report(unit.id, archetype)
			if (!canMove)
				return null

			let lastStep = choice.source

			for (const step of choice.path) {
				const placeA = lastStep
				const placeB = step
				if (isValidStep(agent, archetype.move.verticality, placeA, placeB))
					lastStep = placeB
				else
					break
			}

			return {
				...choice,
				commit: () => {
					unitFreedom.countMove(unit.id)
					unit.place = lastStep
					this.#rerender()
				},
			}
		},

		attack: (choice: Choice.Attack) => {
			const {agent, unitFreedom, turnTracker} = this
			const report = attackReport(agent, agent.currentTurn, choice)
			if (report) {
				const archetype = agent.archetype(report.sourceUnit.kind)
				const {canAttack} = unitFreedom.report(report.sourceUnit.id, archetype)

				if (!canAttack)
					return null

				if (!turnTracker.ourTurn)
					return null

				return {
					...report,
					commit: () => {
						const {targetUnit, attack} = report
						unitFreedom.countAttack(report.sourceUnit.id)
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

