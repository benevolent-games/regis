
import {css, html} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {Bridge} from "../../utils/bridge.js"
import {ActionBarView} from "../gaming/action-bar.js"
import type {World} from "../../../terminal/parts/world.js"
import {InspectorView} from "../gaming/inspector2/inspector.js"

export const GameplayView = nexus.shadowView(use => (
		world: World,
		bridge: Bridge,
	) => {

	use.name("gameplay")
	use.styles(styles)

	return html`
		${world.canvas}

		<div class="hud">
			${ActionBarView([bridge])}
			${InspectorView([bridge])}
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

		> [view="inspector"] {
			pointer-events: none;
			z-index: 1;
			position: absolute;
			user-select: auto;
			padding: 1em;

			width: 100%;
			bottom: 0;
			left: 0;
			right: 0;

			overflow: hidden;
		}
	}
`

