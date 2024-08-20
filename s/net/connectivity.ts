
import {OpSignal, pubsub} from "@benev/slate"

import {Reporting} from "./reporting.js"
import {randomize} from "../tools/randomize.js"
import {DirectorClient, makeDirectorClient} from "../director/plumbing/client.js"

const retryDelay = 10_000
const url = `//${window.location.hostname}:8000/`

export class Connectivity {
	stayConnected = true
	connectionLost = pubsub<[]>()
	connectionEstablished = pubsub<[]>()

	reporting: Reporting

	get isConnected() {
		return !!this.directorClient.payload && !!this.reporting.info.value
	}

	constructor(public directorClient: OpSignal<DirectorClient>) {
		this.reporting = new Reporting(this)
		this.connect()
	}

	#scheduleRetry() {
		this.directorClient.setError("disconnected")
		if (this.stayConnected)
			setTimeout(() => this.connect(), randomize(retryDelay))
	}

	async connect() {
		try {
			console.log("attempt connect")
			const client = await this.directorClient.load(
				() => makeDirectorClient(url)
			)
			console.log("connection established")
			this.connectionEstablished.publish()
			const lost = () => {
				console.log("connection lost")
				this.#scheduleRetry()
				this.connectionLost.publish()
			}
			client.socket.addEventListener("close", lost)
			client.socket.addEventListener("error", lost)
		}
		catch (error) {
			console.log("connection attempt failed")
			this.#scheduleRetry()
		}
	}
}

