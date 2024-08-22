
import "@benev/slate/x/node.js"
import {expose, PrettyLogger, remote, errstring, remoteErrstring} from "renraku"
import {deathWithDignity, WebSocketServer} from "renraku/x/node.js"

import {Director} from "../director.js"
import {constants} from "../../constants.js"
import {Clientside} from "../apis/clientside.js"

const host = "0.0.0.0"
const port = 8000

const logger = new PrettyLogger()
deathWithDignity({logger})

const director = new Director()

const server = new WebSocketServer({
	onError: error => logger.error(errstring(error)),
	timeout: constants.net.timeout,
	acceptConnection: connection => {
		const pingingInterval = setInterval(() => connection.ping(), 3_000)
		const clientside = remote<Clientside>(connection.remoteEndpoint)
		const client = director.acceptClient(clientside, connection.close)
		logger.log(`🧔 [${client.clientId}] connected`)
		return {
			localEndpoint: expose(() => client.serverside, {
				onError: (error, id, method) => {
					logger.error(remoteErrstring(error, id, method))
				},
				onInvocation: request => {
					logger.log([
						`🔔`,
						`[${client.clientId}]`,
						"id" in request
							? `#${request.id}`
							: null,
						`${request.method}()`
					].filter(part => !!part).join(" "))
				},
			}),
			closed: () => {
				clearInterval(pingingInterval)
				client.disconnected()
				logger.log(`💀 [${client.clientId}] disconnected`)
			},
		}
	},
})

server.listen(port, host, () => console.log(`🤖 director server on port ${port}..\n`))

