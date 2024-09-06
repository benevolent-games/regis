
import {Archetypes} from "../units/archetype.js"
import {TimeRules} from "../../tools/chess-timer/types.js"

export type GameConfig = {
	time?: TimeRules
	archetypes: Archetypes
	resources: ResourcesConfig
	watchtowers: WatchtowersConfig
	teams: TeamConfig[]
}

export type ResourcesConfig = {
	startingResources: number
	universalBasicIncome: number
	mining: {
		specialResource: ResourceValues
		resource: [ResourceValues, ResourceValues, ResourceValues]
	}
}

export type ResourceLevel = 1 | 2 | 3

export type ResourceValues = {
	stock: number
	revenue: number
	stakeCost: number
}

export type WatchtowersConfig = {
	stakeCost: number
}

export type TeamConfig = {
	name: string
}

