
import {Trashbin} from "@benev/slate"
import {Agent} from "../logic/agent.js"
import {PregameTimer} from "./pregame-timer.js"
import {InitialMemo} from "../director/apis/clientside.js"
import {ClientMachinery} from "../director/plumbing/machinery.js"
import {TimerObserver} from "../tools/chess-timer/timer-observer.js"

export type GameStatus = "pregame" | "gameplay" | "gameover"

export class GameSession {
	agent: Agent
	pregameTimer: PregameTimer
	timerObserver: TimerObserver | null = null

	status: GameStatus = "pregame"

	#bin = new Trashbin()

	constructor(machinery: ClientMachinery, public memo: InitialMemo) {
		this.agent = new Agent(memo.agentState)
		this.pregameTimer = new PregameTimer(memo.pregameDelay)
		const d = this.#bin.disposer

		d(machinery.onGameStart(memo => {
			this.timerObserver = new TimerObserver(
				this.agent.state.initial.config.time,
				memo.timeReport,
			)
			this.status = "gameplay"
		}))

		d(machinery.onGameUpdate(memo => {
			this.agent.state = memo.agentState

			if (this.timerObserver)
				this.timerObserver.update(memo.timeReport)

			if (this.agent.conclusion)
				this.status = "gameover"
		}))
	}

	dispose() {
		this.#bin.dispose()
	}
}

