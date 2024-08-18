
import {expose, remote} from "renraku"
import {WebSocketServer} from "renraku/x/node.js"

import {Director} from "../director.js"
import {Clientside} from "../apis/clientside.js"

export const makeDirectorServer = () => {
	const director = new Director()

	return new WebSocketServer({
		acceptConnection: connection => {
			const pingingInterval = setInterval(() => connection.ping(), 3_000)
			const clientside = remote<Clientside>(connection.remoteEndpoint)
			const {clientId, serverside} = director.acceptClient(clientside, connection.close)
			return {
				closed: () => {
					clearInterval(pingingInterval)
					director.goodbyeClient(clientId)
				},
				localEndpoint: expose(() => serverside),
			}
		},
	})
}

