
import {Agent} from "../agent.js"
import {Choice} from "../state.js"
import {Chalkboard} from "../utils/chalkboard.js"
import {UnitFreedom} from "../simulation/aspects/unit-freedom.js"
import {TurnTracker} from "../simulation/aspects/turn-tracker.js"

export type ActivityOptions = {
	agent: Agent
	turnTracker: TurnTracker
	freedom: UnitFreedom
	chalkboard: Chalkboard
}

export type Activity<C extends Choice.Any = Choice.Any, A extends any[] = any[]> = {
	propose: (...args: A) => (Rebuke | Proposal<C>)
	judge: (c: C) => (Rebuke | Judgement)
}

export function activity<C extends Choice.Any>() {
	return function<A extends any[]>(fn: (options: ActivityOptions) => Activity<C, A>) {
		return fn
	}
}

export class Rebuke {
	constructor(public reason = "invalid") {}
}

export class SoftRebuke extends Rebuke {}

export class Proposal<C extends Choice.Any = Choice.Any> {
	constructor(public choice: C) {}
}

export class Judgement<C extends Choice.Any = Choice.Any> {
	constructor(public choice: C, public commit: () => void) {}
}

