
import {css, html} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {TimeDisplay} from "../../utils/time-display.js"
import type {World} from "../../../terminal/parts/world.js"

export const GameplayView = nexus.shadowView(use => (
		world: World,
		timeDisplay: TimeDisplay,
	) => {

	use.styles(styles)
	use.name("gameplay")

	const ourTeam = timeDisplay.ourTeam.value
	const remaining = timeDisplay.remaining.value

	return html`
		${world.canvas}
		${remaining === null ? null : html`
			<div
				class=timer
				?data-danger-low="${remaining < 5_000}"
				?data-our-team="${ourTeam}">
					${(remaining / 1000).toFixed(0)}
			</div>
		`}
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

	.timer {
		z-index: 1;
		position: absolute;
		pointer-events: none;
		top: 0;
		left: 0;
		right: 0;
		margin: 0 auto;
		padding: 1em;
		width: max-content;

		opacity: 0.3;
		font-family: monospace;
		color: white;

		&[data-our-team] {
			opacity: 1;
		}

		&[data-danger-low] {
			color: red;
		}
	}
`

