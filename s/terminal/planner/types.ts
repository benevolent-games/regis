
import {Assets} from "../parts/assets.js"
import {Agent} from "../../logic/agent.js"
import {Choice} from "../../logic/state.js"
import {Selectacon} from "../parts/selectacon.js"
import {SubmitTurnFn} from "../../logic/arbiter.js"
import {TurnTracker} from "../../logic/simulation/aspects/turn-tracker.js"
import {Proposers} from "../../logic/simulation/proposer/make-proposers.js"

export type PlannerOptions = {
	agent: Agent
	assets: Assets
	selectacon: Selectacon
	turnTracker: TurnTracker
	submitTurn: SubmitTurnFn
}

export type ConsiderationOptions = {
	proposers: Proposers
	commit: (choice: Choice.Any) => void
} & PlannerOptions

export type ConsiderationFn = (
	(options: ConsiderationOptions) =>
	(...a: any[]) =>
	ConsiderationResult
)

export function considerationFn<F extends ConsiderationFn>(fn: F) {
	return fn
}

export type Indicate = undefined | "pattern" | "action"

export type ConsiderationResult = {
	indicate: Indicate
	actuate: undefined | (() => void)
}

