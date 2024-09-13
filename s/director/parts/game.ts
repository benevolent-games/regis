
import {interval, nap, Trashbin} from "@benev/slate"

import {Turn} from "../../logic/state.js"
import {Couple, Person} from "../types.js"
import {seconds} from "../../tools/timely.js"
import {logErr} from "../../tools/log-err.js"
import {Arbiter} from "../../logic/arbiter.js"
import {asciiMap} from "../../logic/ascii/ascii-map.js"
import {randomMap} from "../../config/game/map-access.js"
import {ChessTimer} from "../../tools/chess-timer/chess-timer.js"

export type GameOptions = {
	couple: Couple
	removeThisGame: () => void
	stillConnected: (person: Person) => boolean
}

export class Game {
	#trash = new Trashbin()

	couple: Couple
	pregameDelay = seconds(10)
	arbiter = new Arbiter(asciiMap(randomMap()))

	phase: "pregame" | "gameplay" = "pregame"

	timer = new ChessTimer(
		this.arbiter.state.initial.config.time,
		this.arbiter.state.teams.length,
	)

	constructor(private options: GameOptions) {
		const d = this.#trash.disposer

		// randomize teams
		this.couple = (Math.random() > 0.5)
			? options.couple.toReversed() as Couple
			: options.couple

		// tell the timer whenever the turn changes
		d(this.arbiter.onStateChange(() => {
			this.timer.team = this.arbiter.activeTeamId
		}))

		// check the timer and end the game when time expires
		d(interval(100, () => {
			if (this.arbiter.conclusion)
				return
			const {gameTime, teamwise} = this.timer.report()
			for (const [teamId, teamReport] of teamwise.entries()) {
				if (teamReport.expired) {
					this.arbiter.commit({
						kind: "timeExpired",
						gameTime,
						eliminatedTeamId: teamId,
					})
					this.#broadcastGameUpdate().catch(logErr)
					break
				}
			}
		}))
	}

	async initialize() {

		// broadcast game initialization memo
		await this.#broadcast(
			async({clientside}, teamId) => await clientside.game.initialize({
				teamId,
				pregameDelay: this.pregameDelay,
				agentState: this.arbiter.teamAgent(teamId).state,
			})
		)

		// send game start after pregame delay
		nap(this.pregameDelay).then(async() => {

			// cancel if somebody surrendered during pregame
			if (this.arbiter.conclusion)
				return undefined

			this.timer.reset()
			this.phase = "gameplay"

			await this.#broadcast(
				async({clientside}) => await clientside.game.start({
					timeReport: this.timer.report(),
				})
			)
		}).catch(logErr)
	}

	getTeamId(person: Person) {
		const teamId = this.couple.indexOf(person)
		if (teamId === -1) throw new Error("person not in game")
		return teamId
	}

	async submitTurn(turn: Turn, teamId: number) {
		const isCorrectPhase = this.phase === "gameplay"
		const isRighteousTurn = this.arbiter.activeTeamId === teamId

		if (isCorrectPhase && isRighteousTurn) {
			const {gameTime} = this.timer.report()
			this.arbiter.commit({kind: "turn", turn, gameTime})
			if (this.arbiter.conclusion)
				this.#end()
			await this.#broadcastGameUpdate()
		}
	}

	async submitSurrender(teamId: number) {
		if (!this.arbiter.conclusion) {
			const {gameTime} = this.timer.report()
			this.arbiter.commit({
				kind: "surrender",
				gameTime,
				eliminatedTeamId: teamId,
			})
			this.#end()
			await this.#broadcastGameUpdate()
		}
	}

	dispose() {
		this.#trash.dispose()
	}

	//////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////

	async #broadcast(fn: (person: Person, teamId: number) => Promise<void>) {
		return await Promise.all(
			this.couple.map(async(person, teamId) => {
				if (this.options.stillConnected(person))
					await fn(person, teamId)
			})
		)
	}

	async #broadcastGameUpdate() {
		await this.#broadcast(async({clientside}, teamId) => {
			const timeReport = this.timer.report()
			const agentState = this.arbiter.teamAgent(teamId).state
			return await clientside.game.update({timeReport, agentState})
		}).catch(logErr)
	}

	#end() {
		this.dispose()
		this.options.removeThisGame()
	}
}

