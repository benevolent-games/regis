
import {Context, signal} from "@benev/slate"

import {theme} from "./theme.js"
import {InputMethod} from "./utils/input-method.js"
import {Connectivity} from "../net/connectivity.js"
import {MatchmakingLiaison} from "../net/matchmaking-liaison.js"

export class GameContext extends Context {
	theme = theme
	inputMethod = signal<InputMethod>("none")
	connectivity = new Connectivity()
	matchmaking = new MatchmakingLiaison(this.connectivity)
}

