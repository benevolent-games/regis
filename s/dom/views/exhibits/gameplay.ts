
import {css, html, Signal} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {Porthole} from "../../utils/porthole.js"
import {ActionBarView} from "../gaming/action-bar.js"
import type {World} from "../../../terminal/parts/world.js"

export const GameplayView = nexus.shadowView(use => (
		world: World,
		porthole: Signal<Porthole>
	) => {

	use.name("gameplay")
	use.styles(styles)

	return html`
		${world.canvas}
		<div class="hud">
			${ActionBarView([porthole])}
		</div>
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

	.hud {
		pointer-events: none;
		z-index: 1;
		position: relative;
		inset: 0;
		margin: auto;

		aspect-ratio: 16 / 9;
		width: auto;
		height: 100%;
		max-width: 100%;

		> [view="actionbar"] {
			z-index: 1;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			margin: 0 auto;
			padding: 0.5em;
		}
	}
`

