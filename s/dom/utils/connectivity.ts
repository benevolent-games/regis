
import {OpSignal} from "@benev/slate"
import {DirectorClient, makeDirectorClient} from "../../director/plumbing/client.js"

const retryDelay = 10_000
const url = `//${window.location.hostname}:8000/`

export class Connectivity {
	stayConnected = true

	constructor(public directorClient: OpSignal<DirectorClient>) {}

	get randomizedDelay() {
		const half = retryDelay / 2
		return half + (2 * half * Math.random())
	}

	#scheduleRetry() {
		if (this.stayConnected) {
			this.directorClient.setError("disconnected")
			setTimeout(() => this.connect(), this.randomizedDelay)
		}
	}

	async connect() {
		try {
			const client = await this.directorClient.load(
				() => makeDirectorClient(url)
			)
			client.socket.addEventListener("close", () => this.#scheduleRetry())
			client.socket.addEventListener("error", () => this.#scheduleRetry())
		}
		catch (error) {
			this.#scheduleRetry()
		}
	}
}

