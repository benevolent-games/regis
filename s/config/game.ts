
import {seconds} from "../tools/timely.js"
import {GameConfig} from "./game/types.js"
import {standardArchetypes} from "./units.js"

export function standardGameConfig(): GameConfig {
	return {
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
					{revenue: 1, stakeCost: 4, stock: 24 * 1},
					{revenue: 2, stakeCost: 12, stock: 24 * 2},
					{revenue: 3, stakeCost: 16, stock: 24 * 3},
				],
				specialResource: {revenue: 3, stakeCost: 4, stock: 24},
			},
		},
		teams: [
			{name: "White"},
			{name: "Black"},
		],
		archetypes: standardArchetypes(),
	}
}

