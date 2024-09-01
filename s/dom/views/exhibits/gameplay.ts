
import {css, html} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {UiData} from "../../utils/ui-data.js"
import {ActionBarView} from "../gaming/action-bar.js"
import type {World} from "../../../terminal/parts/world.js"

export const GameplayView = nexus.shadowView(use => (
		world: World,
		uiData: UiData,
	) => {

	use.name("gameplay")
	use.styles(styles)

	return html`
		${ActionBarView([uiData])}
		${world.canvas}
	`
})

export const styles = css`
	:host {
		display: block;
		position: relative;
		width: 100%;
		height: 100%;
	}

	canvas {
		position: absolute;
		display: block;
		width: 100%;
		height: 100%;

		&:focus {
			outline: 0;
		}
	}

	[view="actionbar"] {
		z-index: 1;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		margin: 0 auto;
		padding: 0.5em;
	}
`

