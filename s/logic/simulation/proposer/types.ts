
import {Agent} from "../../agent.js"
import {Chalkboard} from "./chalkboard.js"
import {Denial} from "../aspects/denials.js"
import {TurnTracker} from "../aspects/turn-tracker.js"
import {UnitFreedom} from "../aspects/unit-freedom.js"

export type Proposal = Denial | (() => void)

export type ProposerFn = (options: ProposerOptions) => (...a: any[]) => Proposal

export type ProposerOptions = {
	agent: Agent
	freedom: UnitFreedom
	chalkboard: Chalkboard
	turnTracker: TurnTracker
}

export function proposerFn<F extends ProposerFn>(fn: F) {
	return fn
}

