
import {Choice} from "../../logic/state.js"
import {considerHeal} from "./considerations/heal.js"
import {considerAttack} from "./considerations/attack.js"
import {considerRecruit} from "./considerations/recruit.js"
import {considerMovement} from "./considerations/movement.js"
import {ConsiderationOptions, PlannerOptions} from "./types.js"
import {Proposers} from "../../logic/simulation/proposer/make-proposers.js"

export type Considerations = ReturnType<typeof makeConsiderations>

export function makeConsiderations(setup: {
		proposers: Proposers
		plannerOptions: PlannerOptions
		commit: (choice: Choice.Any) => void
	}) {

	const {plannerOptions, ...more} = setup

	const consideration: ConsiderationOptions = {
		...plannerOptions,
		...more,
	}

	return {
		recruit: considerRecruit(consideration),
		movement: considerMovement(consideration),
		attack: considerAttack(consideration),
		heal: considerHeal(consideration),
	}
}

