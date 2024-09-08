
import {Agent} from "../agent.js"
import {Choice} from "../state.js"
import {Chalkboard} from "../utils/chalkboard.js"
import {TurnTracker} from "../simulation/aspects/turn-tracker.js"
import {UnitTaskTracker} from "../simulation/aspects/unit-task-tracker.js"

export type ActivityOptions = {
	agent: Agent
	chalkboard: Chalkboard
	turnTracker: TurnTracker
	unitTaskTracker: UnitTaskTracker
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

