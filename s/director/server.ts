
import {Api, expose, remote} from "renraku"
import {Matchmaker} from "./parts/matching.js"
import {Clientside} from "./apis/clientside.js"
import {WebSocketServer} from "renraku/x/node.js"
import {makeServersideApi} from "./apis/serverside.js"

export const makeServer = () => {
	const matchmaker = new Matchmaker()

	return new WebSocketServer({
		acceptConnection: connection => {
			const interval = setInterval(() => connection.ping(), 4_000)
			const clientside = remote<Api<Clientside>>(connection.remoteEndpoint)

			return {
				closed: () => clearInterval(interval),
				localEndpoint: expose(makeServersideApi(matchmaker, clientside)),
			}
		},
	})
}

