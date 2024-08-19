
import {Context, signal, signals} from "@benev/slate"

import {theme} from "./theme.js"
import {InputMethod} from "./utils/input-method.js"
import {Connectivity} from "./utils/connectivity.js"
import {DirectorClient} from "../director/plumbing/client.js"

export class GameContext extends Context {
	theme = theme
	inputMethod = signal<InputMethod>("none")
	directorClient = signals.op<DirectorClient>()
	connectivity = new Connectivity(this.directorClient)

	constructor() {
		super()
		this.connectivity.connect()
	}
}

