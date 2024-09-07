
import {Agent} from "../agent.js"
import {Choice, ChoiceKind} from "../state.js"
import {Chalkboard} from "../utils/chalkboard.js"
import {Activity, ActivityOptions} from "./types.js"
import {TurnTracker} from "../simulation/aspects/turn-tracker.js"
import {UnitFreedom} from "../simulation/aspects/unit-freedom.js"

import {heal} from "./activity/heal.js"
import {attack} from "./activity/attack.js"
import {recruit} from "./activity/recruit.js"
import {movement} from "./activity/movement.js"

export class Activities {
	freedom = new UnitFreedom()
	chalkboard = new Chalkboard()
	#group: ActivityGroup

	constructor(options: {
			agent: Agent
			turnTracker: TurnTracker
		}) {

		this.#group = makeActivityGroup({
			...options,
			freedom: this.freedom,
			chalkboard: this.chalkboard,
		})
	}

	get(choiceKind: ChoiceKind) {
		return this.#group[choiceKind] as Activity
	}

	judge(choice: Choice.Any) {
		return this.get(choice.kind).judge(choice)
	}
}

export type ActivityGroup = ReturnType<typeof makeActivityGroup>

export function makeActivityGroup(options: ActivityOptions) {
	return {
		movement: movement(options),
		attack: attack(options),
		recruit: recruit(options),
		heal: heal(options),
	} satisfies {[K in ChoiceKind]: any}
}

