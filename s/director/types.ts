
export type ClientId = number

export type WorldStats = {
	games: number
	players: number
	gamesInLastHour: number
}

export type ClientStatus = (
	| "chilling"
	| "queued"
	| "gaming"
)

export type RegularReport = {
	worldStats: WorldStats
	clientStatus: ClientStatus
}

