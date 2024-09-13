
import {signal, Signal, Trashbin} from "@benev/slate"

import {Agent} from "../../logic/agent.js"
import {Terminal} from "../../terminal/terminal.js"
import {Cell} from "../../terminal/parts/selectacon.js"
import {TimeReport} from "../../tools/chess-timer/types.js"
import {PregameTimeReport} from "../../net/pregame-timer.js"

/** data from the game world packaged up for the ui to access */
export class Bridge {
	terminal: Terminal

	agent: Signal<Agent>
	teamId: Signal<number>
	selectaconHover = signal<Cell | null>(null)
	selectaconSelection = signal<Cell | null>(null)
	timeReport: Signal<PregameTimeReport | TimeReport>

	actions: {
		surrender: () => Promise<void>
	}

	#trash = new Trashbin()

	constructor(private options: {
			terminal: Terminal
			getTeamId: () => number
			getTimeReport: () => PregameTimeReport | TimeReport
			surrender: () => Promise<void>
		}) {

		const agent = options.terminal.previewAgent

		this.terminal = options.terminal
		this.agent = signal(agent)
		this.teamId = signal(options.getTeamId())
		this.timeReport = signal(options.getTimeReport())

		const d = this.#trash.disposer

		d(agent.onStateChange(() => {
			this.agent.publish()
			this.teamId.value = options.getTeamId()
		}))

		d(options.terminal.selectacon.hover.on(cell => {
			this.selectaconHover.value = cell
		}))

		d(options.terminal.selectacon.selection.on(cell => {
			this.selectaconSelection.value = cell
		}))

		this.actions = {
			surrender: options.surrender,
		}
	}

	updateTime = () => {
		this.timeReport.value = this.options.getTimeReport()
	}

	dispose() {
		this.#trash.dispose()
	}
}

