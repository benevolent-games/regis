
import {OpSignal, pubsub} from "@benev/slate"
import {DirectorClient, makeDirectorClient} from "../../director/plumbing/client.js"

const retryDelay = 10_000
const url = `//${window.location.hostname}:8000/`

export class Connectivity {
	stayConnected = true
	connectionLost = pubsub<[]>()

	constructor(public directorClient: OpSignal<DirectorClient>) {}

	get randomizedDelay() {
		const half = retryDelay / 2
		return half + (2 * half * Math.random())
	}

	#scheduleRetry() {
		this.directorClient.setError("disconnected")
		if (this.stayConnected)
			setTimeout(() => this.connect(), this.randomizedDelay)
	}

	async connect() {
		try {
			const client = await this.directorClient.load(
				() => makeDirectorClient(url)
			)
			const lost = () => {
				this.#scheduleRetry()
				this.connectionLost.publish()
			}
			client.socket.addEventListener("close", lost)
			client.socket.addEventListener("error", lost)
		}
		catch (error) {
			this.#scheduleRetry()
		}
	}
}

