
import {seconds} from "../tools/timely.js"
import {GameConfig} from "./game/types.js"
import {standardArchetypes} from "./units.js"

export function standardGameConfig(): GameConfig {
	const archetypes = standardArchetypes()
	return {
		archetypes,
		time: {
			limit: seconds(120),
			delay: seconds(5),
			charity: seconds(0),
		},
		watchtowers: {stakeCost: 0},
		resources: {
			startingResources: 8,
			universalBasicIncome: 1,
			mining: {
				resource: [
					{revenue: 1, stakeCost: 4},
					{revenue: 2, stakeCost: 12},
					{revenue: 3, stakeCost: 16},
				],
				specialResource: {revenue: 3, stakeCost: 4},
			},
		},
		teams: [
			{name: "White"},
			{name: "Black"},
		],
	}
}

