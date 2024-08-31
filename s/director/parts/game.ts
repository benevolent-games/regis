
import {Trashbin} from "@benev/slate"
import {Couple} from "../types.js"
import {randomMap} from "../../map-pool.js"
import {Arbiter} from "../../logic/arbiter.js"
import {ChessTimer} from "../../logic/utilities/chess-timer.js"

export class Game {
	#trash = new Trashbin()

	couple: Couple
	arbiter = new Arbiter({map: randomMap()})

	timer = new ChessTimer(
		this.arbiter.state.initial.config.time,
		this.arbiter.state.teams.length,
	)

	constructor(
			public id: number,
			couple: Couple,
		) {

		// randomize teams
		this.couple = (Math.random() > 0.5)
			? couple.toReversed() as Couple
			: couple

		// tell the timer whenever the turn changes
		this.#trash.disposer(
			this.arbiter.statesRef.on(() => {
				const team = this.arbiter.agent.activeTeamIndex
				this.timer.team = team
			})
		)
	}

	dispose() {
		this.#trash.dispose()
	}
}

