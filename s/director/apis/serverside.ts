
import {api} from "renraku"
import {Clientside} from "./clientside.js"
import {Matchmaker} from "../parts/matching.js"

export type Serverside = {
	joinQueue(): Promise<void>
	submitTurn(): Promise<void>
}

export function makeServersideApi(
		matchmaker: Matchmaker,
		clientside: Clientside,
	) {
	return api((): Serverside => ({
		async joinQueue() {
			matchmaker.queue.add(clientside)
			for (const {id, match} of matchmaker.makeMatches())
				match.pair
					.forEach(c => c.matchStart(id))
		},
		async submitTurn() {},
	}))
}

