
import {opSignal, pubsub} from "@benev/slate"

import {constants} from "../constants.js"
import {randomize} from "../tools/randomize.js"
import {RegularReport} from "../director/types.js"
import {Serverside} from "../director/apis/serverside.js"
import {ClientMachinery} from "../director/plumbing/machinery.js"
import {makeDirectorClient} from "../director/plumbing/client.js"

const isLocalDev = (
	location.host.startsWith("localhost") ||
	location.host.startsWith("192.168") ||
	location.host.startsWith("10.0.0")
)

const directorUrl = isLocalDev
	? `//${window.location.hostname}:8000/`
	: `wss://director.regis.gg/`

export type Connection = {
	socket: WebSocket
	serverside: Serverside
	ping: number
	report: RegularReport
}

async function queryReport(serverside: Serverside) {
	const start = Date.now()
	const report = await serverside.report()
	const ping = Date.now() - start
	return {report, ping}
}

export class Connectivity {
	connection = opSignal<Connection | null>()
	onConnected = pubsub<[Connection]>()
	onDisconnected = pubsub()

	machinery = new ClientMachinery()

	constructor() {
		this.connect()
		this.repeatedReporting()
	}

	#scheduleReconnect() {
		setTimeout(() => this.connect(), randomize(constants.net.reconnectDelay))
	}

	async connect() {
		console.log("attempt connect")
		const connection = await this.connection.load(async() => {
			try {
				const client = await makeDirectorClient(directorUrl, this.machinery)
				const info = await queryReport(client.serverside)
				const lost = () => {
					console.log("connection lost")
					this.#scheduleReconnect()
					this.connection.setReady(null)
					this.onDisconnected.publish()
				}
				client.socket.addEventListener("close", lost)
				client.socket.addEventListener("error", lost)
				console.log("connection established")
				return {...client, ...info}
			}
			catch (error) {
				this.#scheduleReconnect()
				console.log("connection failed")
				return null
			}
		})

		if (connection)
			this.onConnected.publish(connection)
		else
			this.onDisconnected.publish()

		return connection
	}

	async queryReport() {
		const connection = this.connection.payload
		if (connection) {
			const info = await queryReport(connection.serverside)
			connection.ping = info.ping
			connection.report = info.report
			this.connection.publish()
		}
	}

	async repeatedReporting() {
		await this.queryReport()
		setTimeout(() => this.repeatedReporting(), constants.net.reportingDelay)
	}
}

