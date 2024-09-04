
export type UnitRendering = (
	| NormalUnitRendering
	| ObstacleUnitRendering
)

export type NormalUnitRendering = {
	algo: "normal"
	name?: string
	scale?: number
}

export type ObstacleUnitRendering = {
	algo: "obstacle"
	name?: string
	scale?: number
}

