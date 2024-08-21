
import "@benev/slate/x/node.js"
import {errorString, expose, PrettyLogger, remote} from "renraku"
import {deathWithDignity, WebSocketServer} from "renraku/x/node.js"

import {Director} from "../director.js"
import {constants} from "../../constants.js"
import {Clientside} from "../apis/clientside.js"

const host = "0.0.0.0"
const port = 8000

const logger = new PrettyLogger()
const onError = (error: any) => logger.error(errorString(error))
deathWithDignity({logger})

const director = new Director()

const server = new WebSocketServer({
	onError,
	timeout: constants.net.timeout,
	acceptConnection: connection => {
		const pingingInterval = setInterval(() => connection.ping(), 3_000)
		const clientside = remote<Clientside>(connection.remoteEndpoint)
		const client = director.acceptClient(clientside, connection.close)
		logger.log(`🧔 client appears {${client.clientId}}`)
		return {
			localEndpoint: expose(() => client.serverside, {
				onError,
				onInvocation: request => {
					logger.log(`  🔔 {${client.clientId}} [${"id" in request ? request.id : ""}] ${request.method}`)
				},
			}),
			closed: () => {
				clearInterval(pingingInterval)
				client.disconnected()
				logger.log(`💀 client leaves {${client.clientId}}`)
			},
		}
	},
})

server.listen(port, host, () => console.log(`🤖 director server on port ${port}..\n`))

