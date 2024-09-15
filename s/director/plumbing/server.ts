
import "@benev/slate/x/node.js"
import {cli, command, param, number} from "@benev/argv"
import {expose, remote, errstring, remoteErrstring} from "renraku"
import {deathWithDignity, WebSocketServer} from "renraku/x/node.js"

import {logger} from "./logger.js"
import {Director} from "../director.js"
import {constants} from "../../constants.js"
import {Clientside} from "../apis/clientside.js"


deathWithDignity({logger})

const {params} = cli(process.argv, {
	name: "director",
	commands: command({
		args: [],
		params: {
			port: param.default(number, "8000"),
		},
	}),
}).tree

const host = "0.0.0.0"
const {port} = params

const director = new Director()

const server = new WebSocketServer({
	onError: error => logger.error(errstring(error)),
	timeout: constants.net.timeout,

	acceptConnection: connection => {
		const pingingInterval = setInterval(() => connection.ping(), 3_000)
		const clientside = remote<Clientside>(connection.remoteEndpoint)

		const {person, serverside, disconnected} = (
			director.newPerson(clientside, connection.close)
		)

		logger.log(`${person.label} connected`)

		return {
			localEndpoint: expose(() => serverside, {
				onError: (error, id, method) => {
					logger.error(remoteErrstring(error, id, method))
				},
				// onInvocation: request => {
				// 	logger.log([
				// 		`🔔`,
				// 		`[${person.id}]`,
				// 		"id" in request
				// 			? `#${request.id}`
				// 			: null,
				// 		`${request.method}()`
				// 	].filter(part => !!part).join(" "))
				// },
			}),

			closed: () => {
				clearInterval(pingingInterval)
				disconnected().catch((e) => logger.error(e))
				logger.log(`${person.label}→🔪→💀 disconnected`)
			},
		}
	},
})

server.listen(port, host, () => console.log(`📡 director running on port ${port}..\n`))

