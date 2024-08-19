
import "@benev/slate/x/node.js"
import {expose, PrettyLogger, remote} from "renraku"
import {deathWithDignity, WebSocketServer} from "renraku/x/node.js"

import {Director} from "../director.js"
import {Clientside} from "../apis/clientside.js"

const logger = new PrettyLogger()

deathWithDignity({logger})

const director = new Director()

const server = new WebSocketServer({
	logger,
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

server.listen(8000, () => console.log("director server running.."))

