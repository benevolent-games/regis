
import {css, html} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {TimeDisplay} from "../../utils/time-display.js"

export const ClockView = nexus.shadowView(use => (
		timeDisplay: TimeDisplay,
	) => {

	use.name("clock")
	use.styles(styles)

	const ourTeam = timeDisplay.ourTeam.value
	const remaining = timeDisplay.remaining.value

	return html`
		${remaining !== null ? html`
			<div class=timer
				?data-danger-low="${remaining < 5_000}"
				?data-our-team="${ourTeam}">
					${(remaining / 1000).toFixed(0)}
			</div>
		` : html`
			time unlimited
		`}
	`
})

export const styles = css`
	.timer {
		min-width: 4em;
		background: #4448;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		font-size: 2em;
		padding: 0.5em;
		opacity: 0.3;
		font-family: monospace;
		color: white;
		text-shadow: .04em .08em .04em #000;
		border-radius: 0.3rem;

		&[data-our-team] {
			opacity: 1;
		}

		&[data-danger-low] {
			color: red;
		}
	}
`

