
import {signal} from "@benev/slate"
import {Connectivity} from "./connectivity.js"
import {RegularReport} from "../director/types.js"

const reportingDelay = 5_000

export type ReportingInfo = {
	report: RegularReport
	ping: number
}

export class Reporting {
	info = signal<ReportingInfo | null>(null)

	constructor(public connectivity: Connectivity) {
		this.repeat()
		connectivity.connectionEstablished(() => this.query())
		connectivity.connectionLost(() => {
			this.info.value = null
			console.log("report lost")
		})
	}

	async query() {
		try {
			if (this.connectivity.directorClient.isReady()) {
				console.log("reporting query")
				const directorClient = this.connectivity.directorClient.payload
				const start = Date.now()
				const report = await directorClient.serverside.report()
				const ping = Date.now() - start
				this.info.value = {report, ping}
			}
		}
		catch (error) {
			this.info.value = null
			console.log("report failed")
		}
	}

	async repeat() {
		this.query()
		setTimeout(() => this.repeat(), reportingDelay)
	}
}

