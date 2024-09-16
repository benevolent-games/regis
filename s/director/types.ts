
import {Remote} from "renraku"
import {Game} from "./parts/game.js"
import {Clientside} from "./apis/clientside.js"

export type WorldStats = {
	games: number
	players: number
	gamesInLastHour: number
}

export type PersonStatus = (
	| "relaxing"
	| "queued"
	| "gaming"
)

export type RegularReport = {
	worldStats: WorldStats
	personStatus: PersonStatus
}

export type Person = {
	label: string
	clientside: Remote<Clientside>
	closeConnection: () => void
}

export type Couple = [Person, Person]

/** one gamer's perspective on an ongoing game */
export type GamerSession = {
	game: Game
	person: Person
	teamId: number
}

