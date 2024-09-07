
import {Agent} from "../agent.js"
import {ActivityOptions} from "./types.js"
import {movement} from "./activity/movement.js"
import {Chalkboard} from "../simulation/proposer/chalkboard.js"
import {TurnTracker} from "../simulation/aspects/turn-tracker.js"
import {UnitFreedom} from "../simulation/aspects/unit-freedom.js"

export type Activities = ReturnType<typeof makeActivities>

export function makeActivities(options: {
		agent: Agent
		turnTracker: TurnTracker
	}) {

	const activityOptions: ActivityOptions = {
		...options,
		freedom: new UnitFreedom(),
		chalkboard: new Chalkboard(),
	}

	return {
		movement: movement(activityOptions),
	}
}

