
import {ChoiceKind} from "../../state.js"
import {proposeHeal} from "./proposers/heal.js"
import {proposeSpawn} from "./proposers/spawn.js"
import {proposeAttack} from "./proposers/attack.js"
import {ProposerFn, ProposerOptions} from "./types.js"
import {proposeMovement} from "./proposers/movement.js"

export type Proposers = ReturnType<typeof makeProposers>

export const makeProposers = (options: ProposerOptions) => ({
	spawn: proposeSpawn(options),
	movement: proposeMovement(options),
	attack: proposeAttack(options),
	heal: proposeHeal(options),
} satisfies Record<ChoiceKind, ReturnType<ProposerFn>>)

