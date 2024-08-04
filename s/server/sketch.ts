
import * as renraku from "renraku"
import * as mapPool from "../map-pool.js"
import {Arbiter} from "../logic/arbiter.js"
import {webSocketServer} from "renraku/x/websocket/socket-server.js"

export const maps = {
	bridge: mapPool.bridge,
	basin: mapPool.basin,
	overpass: mapPool.overpass,
	crossover: mapPool.crossover,
	monument: mapPool.monument,
}

export function randomMap() {
	const maplist = Object.values(maps)
	const index = Math.floor(Math.random() * maplist.length)
	return maplist[index]
}

export type Clients = [ClientRemote, ClientRemote]

export class Match {
	arbiter = new Arbiter(randomMap())
	constructor(public clients: Clients) {}
}

export class Matchmaker {
	getId = (() => {
		let id = 0
		return () => id++
	})()

	queue = new Set<ClientRemote>()
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
		let previous: ClientRemote | null = null
		for (const client of this.queue) {
			if (previous) {
				const pair = [previous, client] as [ClientRemote, ClientRemote]
				this.queue.delete(previous)
				this.queue.delete(client)
				previous = null
				yield pair
			}
		}
	}
}

export const makeServer = () => {
	const matchmaker = new Matchmaker()

	return webSocketServer({
		port: 8000,
		timeout: 20_000,
		logger: console,
		exposeErrors: true,
		maxPayloadSize: 1_000_000,
		acceptConnection: connection => {
			const interval = setInterval(() => connection.controls.ping(), 4_000)
			return {
				api: serverApi({
					matchmaker,
					client: connection.prepareClientApi(clientMetas()),
				}),
				handleConnectionClosed: () => {
					clearInterval(interval)
				},
			}
		},
	})
}

export type ServerApi = ReturnType<typeof serverApi>
export type ServerRemote = renraku.Remote<ServerApi>

export const serverApi = ({client, matchmaker}: {
		client: ClientRemote
		matchmaker: Matchmaker
	}) => {

	return renraku.api({
		multiplayer: renraku.serviette(() => ({
			async joinQueue() {
				matchmaker.queue.add(client)
				for (const {id, match} of matchmaker.makeMatches())
					match.clients
						.forEach(c => c.multiplayer.matchStart(id))
			},
			async submitTurn() {},
		})),
	})
}

export const serverMetas = () => renraku.metas<ClientApi>({
	multiplayer: async() => {},
})

export type ClientApi = ReturnType<typeof clientApi>
export type ClientRemote = renraku.Remote<ClientApi>

export const clientApi = () => renraku.api({
	multiplayer: renraku.serviette(() => ({
		async matchStart(id: number) {},
		async matchUpdate() {},
		async matchFinish() {},
	}))
})

export const clientMetas = () => renraku.metas<ClientApi>({
	multiplayer: async() => {},
})



