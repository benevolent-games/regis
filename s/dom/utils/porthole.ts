
import {signal, Signal} from "@benev/slate"

import {Agent} from "../../logic/agent.js"
import {Terminal} from "../../terminal/terminal.js"
import {TimeReport} from "../../tools/chess-timer/types.js"
import {Selectacon} from "../../terminal/parts/selectacon.js"
import {TerminalActions} from "../../terminal/parts/terminal-actions.js"

export type Porthole = {
	agent: Agent
	teamId: number
	timeReport: TimeReport
	selectacon: Selectacon
	actions: TerminalActions
}

export class PortholePod {
	porthole: Signal<Porthole>

	fn = () => ({
		agent: this.terminal.previewAgent,
		teamId: this.terminal.previewAgent.activeTeamId,
		actions: this.terminal.actions,
		selectacon: this.terminal.selectacon,
		timeReport: this.getTimeReport(),
	})

	constructor(
			private terminal: Terminal,
			private getTimeReport: () => TimeReport,
		) {
		this.porthole = signal(this.fn())
	}

	update = () => {
		this.porthole.value = this.fn()
	}
}

