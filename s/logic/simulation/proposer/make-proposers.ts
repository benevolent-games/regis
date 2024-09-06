
import {ChoiceKind} from "../../state.js"
import {proposeHeal} from "./proposers/heal.js"
import {proposeAttack} from "./proposers/attack.js"
import {proposeRecruit} from "./proposers/recruit.js"
import {ProposerFn, ProposerOptions} from "./types.js"
import {proposeMovement} from "./proposers/movement.js"

export type Proposers = ReturnType<typeof makeProposers>

export const makeProposers = (options: ProposerOptions) => ({
	recruit: proposeRecruit(options),
	movement: proposeMovement(options),
	attack: proposeAttack(options),
	heal: proposeHeal(options),
} satisfies Record<ChoiceKind, ReturnType<ProposerFn>>)

