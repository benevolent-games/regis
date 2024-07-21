
import {AgentState} from "./state/game.js"
import {boardery} from "./helpers/boardery.js"
import {unitry} from "./helpers/unitry.js"

export class Interpreter {
	constructor(public getState: () => AgentState) {}

	get state() {
		return this.getState()
	}

	get board() {
		return boardery(this.state.board)
	}

	get units() {
		return unitry(this.state.units)
	}
}

