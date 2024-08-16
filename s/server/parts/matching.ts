
import {randomMap} from "./director.js"
import {Arbiter} from "../../logic/arbiter.js"
import {Clientside} from "../apis/clientside.js"

export type Pair = [Clientside, Clientside]

export class Match {
	arbiter = new Arbiter(randomMap().ascii)
	constructor(public pair: Pair) {}
}

export class Matchmaker {
	getId = (() => {
		let id = 0
		return () => id++
	})()

	queue = new Set<Clientside>()
	matches = new Map<number, Match>()

	;*makeMatches() {
		for (const clients of this.#extractPairs()) {
			if (Math.random() > 0.5)
				clients.reverse()
			const match = new Match(clients)
			const id = this.getId()
			this.matches.set(id, match)
			yield {id, match}
		}
	}

	;*#extractPairs() {
		let previous: Clientside | null = null
		for (const client of this.queue) {
			if (previous) {
				const pair = [previous, client] as [Clientside, Clientside]
				this.queue.delete(previous)
				this.queue.delete(client)
				previous = null
				yield pair
			}
		}
	}
}

