
import {css} from "@benev/slate"

import {nexus} from "../../nexus.js"
import type {World} from "../../../babylon/world.js"

export const GameplayView = nexus.shadowView(use => (world: World) => {
	use.styles(styles)
	use.name("gameplay")
	return world.canvas
})

export const styles = css`
	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
`
