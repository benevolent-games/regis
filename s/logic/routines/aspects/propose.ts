
import {mapGuarantee} from "@benev/slate"

import {Agent} from "../../agent.js"
import {calculateMovement} from "./moving.js"
import {isValidSpawnPlace} from "./spawning.js"
import {mintId} from "../../../tools/mint-id.js"
import {Choice, choiceFns} from "../../state.js"
import {canAfford, subtractResources} from "./money.js"

export type Proposition = ReturnType<typeof propose>

export function propose(agent: Agent) {
	const teamId = agent.state.context.currentTurn
	const unitTracking = new Map<string, {alreadyActed: boolean}>()

	return choiceFns({

		spawn(choice: Choice.Spawn) {
			const {cost} = agent.state.initial.config.unitArchetypes[choice.unitKind]
			const buyable = cost !== null
			const affordable = canAfford(agent.currentTeam, cost)
			const valid = isValidSpawnPlace(agent, teamId, choice.place)
			return (buyable && affordable && valid)
				? {
					commit() {
						subtractResources(agent.state, teamId, cost)
						agent.units.add({
							id: mintId(),
							kind: choice.unitKind,
							place: choice.place,
							team: teamId,
							damage: 0,
						})
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

			const track = mapGuarantee(
				unitTracking,
				calculation.unit.id,
				() => ({alreadyActed: false}),
			)

			if (track.alreadyActed)
				return null

			return {
				...choice,
				...calculation,
				commit() {
					track.alreadyActed = true
					calculation.unit.place = choice.target
				},
			}
		},

		attack(choice: Choice.Attack) {},

		investment(choice: Choice.Investment) {},
	})
}

