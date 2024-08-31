
import {Couple} from "../types.js"
import {randomMap} from "../../map-pool.js"
import {Arbiter} from "../../logic/arbiter.js"
import {ChessTimer} from "../../logic/utilities/chess-timer.js"

export class Game {
	couple: Couple
	arbiter = new Arbiter({map: randomMap()})

	timer = new ChessTimer(
		this.arbiter.state.initial.config.time,
		this.arbiter.state.teams.length,
	)

	dispose = this.arbiter.statesRef.on(() => {
		const team = this.arbiter.agent.activeTeamIndex
		this.timer.team = team
	})

	constructor(
			public id: number,
			couple: Couple,
		) {

		// randomize teams
		this.couple = (Math.random() > 0.5)
			? couple.toReversed() as Couple
			: couple
	}

	sendEndGame() {}
}

