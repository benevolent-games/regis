
import {Trashbin} from "@benev/slate"
import {Couple} from "../types.js"
import {Arbiter} from "../../logic/arbiter.js"
import {asciiMap} from "../../logic/ascii/ascii-map.js"
import {randomMap} from "../../logic/routines/map-access.js"
import {ChessTimer} from "../../logic/utilities/chess-timer.js"

export class Game {
	#trash = new Trashbin()

	couple: Couple
	arbiter = new Arbiter(asciiMap(randomMap()))

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
			this.arbiter.onStateChange(() => {
				const team = this.arbiter.activeTeamIndex
				this.timer.team = team
			})
		)
	}

	dispose() {
		this.#trash.dispose()
	}
}

