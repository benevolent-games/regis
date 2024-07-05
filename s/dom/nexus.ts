
import {Nexus, Context, signal} from "@benev/slate"

import {theme} from "./theme.js"
import {InputMethod} from "./utils/input-method.js"

export const nexus = new Nexus(new class extends Context {
	theme = theme
	inputMethod = signal<InputMethod>("none")
})

