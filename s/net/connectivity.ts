
import {opSignal, pubsub} from "@benev/slate"

import {randomize} from "../tools/randomize.js"
import {RegularReport} from "../director/types.js"
import {Serverside} from "../director/apis/serverside.js"
import {makeDirectorClient} from "../director/plumbing/client.js"

const retryDelay = 10_000
const url = `//${window.location.hostname}:8000/`

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

	constructor() {
		this.connect()
		this.repeatedReporting()
	}

	#scheduleReconnect() {
		setTimeout(() => this.connect(), randomize(retryDelay))
	}

	async connect() {
		console.log("attempt connect")
		const connection = await this.connection.load(async() => {
			try {
				const client = await makeDirectorClient(url)
				const info = await queryReport(client.serverside)
				const lost = () => {
					console.log("connection lost")
					this.#scheduleReconnect()
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
		setTimeout(() => this.repeatedReporting(), 5_000)
	}
}

// export class Connectivity {
// 	stayConnected = true
// 	connectionLost = pubsub<[]>()
// 	connectionEstablished = pubsub<[]>()
//
// 	reporting: Reporting
//
// 	get isConnected() {
// 		return !!this.directorClient.payload && !!this.reporting.info.value
// 	}
//
// 	constructor(public directorClient: OpSignal<DirectorClient>) {
// 		this.reporting = new Reporting(this)
// 		this.connect()
// 	}
//
// 	#scheduleRetry() {
// 		this.directorClient.setError("disconnected")
// 		if (this.stayConnected)
// 			setTimeout(() => this.connect(), randomize(retryDelay))
// 	}
//
// 	async connect() {
// 		try {
// 			console.log("attempt connect")
// 			const client = await this.directorClient.load(
// 				() => makeDirectorClient(url)
// 			)
// 			console.log("connection established")
// 			this.connectionEstablished.publish()
// 			const lost = () => {
// 				console.log("connection lost")
// 				this.#scheduleRetry()
// 				this.connectionLost.publish()
// 			}
// 			client.socket.addEventListener("close", lost)
// 			client.socket.addEventListener("error", lost)
// 		}
// 		catch (error) {
// 			console.log("connection attempt failed")
// 			this.#scheduleRetry()
// 		}
// 	}
// }
//
