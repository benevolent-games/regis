
import {expose, remote} from "renraku"
import {WebSocketServer} from "renraku/x/node.js"

import {Director} from "../director.js"
import {Clientside} from "../apis/clientside.js"

export const makeDirectorServer = () => {
	const director = new Director()

	return new WebSocketServer({
		acceptConnection: connection => {
			const interval = setInterval(() => connection.ping(), 3_000)
			const clientside = remote<Clientside>(connection.remoteEndpoint)
			const {serverside} = director.acceptClient(clientside)
			return {
				closed: () => clearInterval(interval),
				localEndpoint: expose(() => serverside),
			}
		},
	})
}

