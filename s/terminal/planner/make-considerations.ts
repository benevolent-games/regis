
import {Choice} from "../../logic/state.js"
import {considerSpawn} from "./considerations/spawn.js"
import {considerAttack} from "./considerations/attack.js"
import {considerMovement} from "./considerations/movement.js"
import {Proposers} from "../../logic/simulation/proposer/make-proposers.js"
import {ConsiderationOptions, InstanceFn, PlannerOptions} from "./types.js"

export type Considerations = ReturnType<typeof makeConsiderations>

export function makeConsiderations(setup: {
		proposers: Proposers
		plannerOptions: PlannerOptions
		instance: InstanceFn
		commit: (choice: Choice.Any) => void
	}) {

	const {plannerOptions, ...more} = setup

	const consideration: ConsiderationOptions = {
		...plannerOptions,
		...more,
	}

	return {
		spawn: considerSpawn(consideration),
		movement: considerMovement(consideration),
		attack: considerAttack(consideration),
	}
}

