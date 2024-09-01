
import {Trashbin} from "@benev/slate"

import {noop} from "../../tools/noop.js"
import {Turn} from "../../logic/state.js"
import {Couple, Person} from "../types.js"
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

	constructor(public id: number, couple: Couple) {
		// randomize teams
		this.couple = (Math.random() > 0.5)
			? couple.toReversed() as Couple
			: couple

		// tell the timer whenever the turn changes
		this.#trash.disposer(
			this.arbiter.onStateChange(() => {
				this.timer.team = this.arbiter.activeTeamId
			})
		)

		// send game start to people
		this.#broadcast(
			async({clientside}, teamId) => await clientside.game.start({
				gameId: id,
				teamId,
				timeReport: this.timer.report(),
				agentState: this.arbiter.teamAgent(teamId).state,
			})
		).catch(noop)
	}

	submitTurn(turn: Turn, teamId: number) {
		const {gameTime} = this.timer
		const timeReport = this.timer.report()
		const righteousTurn = this.arbiter.activeTeamId

		// submit the turn
		if (teamId === righteousTurn)
			this.arbiter.submitTurn({turn, gameTime})

		// send game updates to people
		this.#broadcast(async({clientside}, teamId) => {
			const agentState = this.arbiter.teamAgent(teamId).state
			return await clientside.game.update({timeReport, agentState})
		}).catch(noop)
	}

	async #broadcast(fn: (person: Person, teamId: number) => Promise<void>) {
		let promises: Promise<void>[] = []
		this.couple.forEach((person, teamId) => promises.push(fn(person, teamId)))
		return await Promise.all(promises)
	}

	dispose() {
		this.#trash.dispose()
	}
}

