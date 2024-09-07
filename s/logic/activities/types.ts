
import {Agent} from "../agent.js"
import {Choice} from "../state.js"
import {Chalkboard} from "../simulation/proposer/chalkboard.js"
import {UnitFreedom} from "../simulation/aspects/unit-freedom.js"
import {TurnTracker} from "../simulation/aspects/turn-tracker.js"

export type ActivityOptions = {
	agent: Agent
	turnTracker: TurnTracker

	freedom: UnitFreedom
	chalkboard: Chalkboard
}

export type Composer<A extends any[], C extends Choice.Any> = (...args: A) => (Rebuke | Composition<C>)
export type Judge<C extends Choice.Any> = (c: C) => (Rebuke | Judgement)

export type Gamelogic<A extends any[], C extends Choice.Any> = {
	composer: Composer<A, C>
	judge: Judge<C>
}

//
// result types
//

export class Rebuke {}
export class SoftRebuke extends Rebuke {}

export class Composition<C extends Choice.Any> {
	constructor(public choice: C) {}
}

export class Judgement {
	constructor(public commit: () => void) {}
}

//
// helper fns
//

export const mkActivity = <C extends Choice.Any>() => ({
	composer: <A extends any[]>(composer: Composer<A, C>) => ({
		judge: (judge: Judge<C>): Gamelogic<A, C> => ({
			composer,
			judge,
		}),
	}),
})

export function activity<G extends Gamelogic<any[], any>>(fn: (options: ActivityOptions, mk: typeof mkActivity) => G) {
	return (options: ActivityOptions) => fn(options, mkActivity)
}

