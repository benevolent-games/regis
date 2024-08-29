
import {Agent} from "../agent.js"
import {mintId} from "../../tools/mint-id.js"
import {Choice, ChoiceKind} from "../state.js"
import {Proposal} from "./aspects/proposal.js"
import {isValidStep} from "./aspects/navigation.js"
import {TurnTracker} from "./aspects/turn-tracker.js"
import {UnitFreedom2} from "./aspects/unit-freedom.js"
import {isValidSpawnPlace} from "./aspects/spawning.js"
import {boardCoords} from "../../tools/board-coords.js"
import {canAfford, subtractResources} from "./aspects/money.js"
import {applyDamage, attackReport} from "./aspects/attack-report.js"
import {Denial, InvestmentDenial, MovementDenial, SpawnDenial, WrongTeamDenial} from "./aspects/denials.js"

export class Proposer {
	unitFreedom = new UnitFreedom2()

	constructor(
		private agent: Agent,
		private turnTracker: TurnTracker,
	) {}

	#rerender() {
		this.agent.stateRef.publish()
	}

	propose = {

		spawn: (choice: Choice.Spawn) => {
			const {agent, turnTracker} = this
			const {unitKind} = choice
			const {config} = agent.state.initial
			const {cost} = config.unitArchetypes[unitKind]
			const buyable = cost !== null
			const affordable = canAfford(agent.activeTeam, cost)
			const validPlace = isValidSpawnPlace(agent, agent.activeTeamIndex, choice.place)
			const howManyAlready = [...agent.units.list()]
				.filter(unit => unit.team === agent.activeTeamIndex)
				.filter(unit => unit.kind === choice.unitKind)
				.length
			const {roster} = config.teams.at(agent.activeTeamIndex)!
			const remainingRosterCount = roster[choice.unitKind] - howManyAlready
			const availableInRoster = remainingRosterCount > 0

			if (!buyable)
				return new SpawnDenial(`unit kind "${unitKind}" is not for sale`)

			if (!affordable)
				return new SpawnDenial(`cannot afford "${unitKind}"`)

			if (!availableInRoster)
				return new SpawnDenial(`"${unitKind}" not available in roster`)

			if (!validPlace)
				return new SpawnDenial(`invalid spawn place ${boardCoords(choice.place)}`)

			if (!turnTracker.ourTurn)
				return new WrongTeamDenial(agent.activeTeamIndex)

			return {
				commit: () => {
					subtractResources(agent.state, agent.activeTeamIndex, cost)
					const id = mintId()
					this.unitFreedom.countSpawning(id)
					agent.units.add({
						id,
						kind: choice.unitKind,
						place: choice.place,
						team: agent.activeTeamIndex,
						damage: 0,
					})
					this.#rerender()
				}
			}
		},

		movement: (choice: Choice.Movement) => {
			const {agent, turnTracker, unitFreedom} = this

			const unit = agent.units.at(choice.source)
			if (!unit)
				return new MovementDenial(`no unit found at ${boardCoords(choice.source)}`)

			const archetype = agent.archetype(unit.kind)
			if (!archetype.move)
				return new MovementDenial(`unit archetype "${unit.kind}" does not have move capability`)

			const {canMove} = unitFreedom.report(unit.id, archetype)
			if (!canMove)
				return new MovementDenial(`unit "${unit.kind}" at ${boardCoords(choice.source)} does not have freedom to move`)

			if (!turnTracker.ourTurn)
				return new WrongTeamDenial(agent.activeTeamIndex)

			let lastStep = choice.source

			for (const step of choice.path) {
				const placeA = lastStep
				const placeB = step
				const {verticality} = archetype.move
				if (isValidStep(agent, verticality, placeA, placeB))
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
			const {agent, turnTracker, unitFreedom} = this

			const report = attackReport(agent, choice)
			if (report instanceof Denial)
				return report

			const archetype = agent.archetype(report.sourceUnit.kind)

			const {canAttack} = unitFreedom.report(report.sourceUnit.id, archetype)
			if (!canAttack)
				return new MovementDenial(`unit "${report.sourceUnit.kind}" at ${boardCoords(choice.source)} does not have freedom to attack`)

			if (!turnTracker.ourTurn)
				return new WrongTeamDenial(agent.activeTeamIndex)

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
		},

		investment: (choice: Choice.Investment) => {
			return new InvestmentDenial(`todo investment not yet implemented`)
		},

	} satisfies Record<ChoiceKind, (...args: any[]) => Proposal>
}

