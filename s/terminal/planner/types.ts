
import {Vec2} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core"

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
	instance: InstanceFn
} & PlannerOptions

export type InstanceFn = (fn: () => TransformNode, place: Vec2) => void

export type ConsiderationFn = (
	(options: ConsiderationOptions) =>
	(...a: any[]) =>
	ConsiderationResult
)

export function considerationFn<F extends ConsiderationFn>(fn: F) {
	return fn
}

export type ConsiderationResult = {
	indicate: undefined | (() => void)
	actuate: undefined | (() => void)
}

