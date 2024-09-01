
import {css, html} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {ClockView} from "./clock.js"
import {UiData} from "../../utils/ui-data.js"
import xSvg from "../../icons/tabler/x.svg.js"
import menuSvg from "../../icons/tabler/menu.svg.js"
import circleCheckSvg from "../../icons/tabler/circle-check.svg.js"
import arrowCounterClockwiseSvg from "../../icons/akar/arrow-counter-clockwise.svg.js"

export const ActionBarView = nexus.shadowView(use => (
		uiData: UiData,
	) => {

	use.name("actionbar")
	use.styles(styles)

	return html`
		<div class="chunk static">
			<div class="entry">
				<div class="button">
					${menuSvg}
					<em>tab</em>
				</div>
			</div>
		</div>

		<div class="chunk stretchy left">
			<div class="entry" hidden>
				<div class="button">
					${arrowCounterClockwiseSvg}
					<em>z</em>
				</div>
			</div>

			<div class="entry">
				<div class="button">
					${xSvg}
					<em>ctrl-z</em>
				</div>
			</div>
		</div>

		<div class="chunk static">
			${ClockView([uiData])}
		</div>

		<div class="chunk stretchy right">
			<div class="entry">
				<div class="button juicy">
					<span>Commit Turn</span>
					${circleCheckSvg}
					<em>spacebar</em>
				</div>
			</div>
		</div>

		<div class="chunk static">
			resources
		</div>
	`
})

export const styles = css`
	:host {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;
	}

	.chunk {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;

		align-items: start;
		justify-content: center;

		&.static { flex: 0 0 auto; }
		&.stretchy { flex: 1 1 0; }
	}

	.entry {
		display: flex;
		flex-direction: column;

		> * { flex: 1 0 auto; }

		&[hidden] { display: none; }

		> .button {
			position: relative;
			flex: 0 0 auto;
			width: max-content;
			height: 3em;

			display: flex;
			justify-content: center;
			align-items: center;
			gap: 0.5em;
			padding: 0.2em 1em;

			border: none;
			outline: 0;
			border-radius: 0.3em;
			cursor: pointer;

			text-transform: uppercase;
			font-weight: bold;

			background: #4448;
			&.juicy { background: #2a0a; }

			opacity: 0.8;
			&:is(:hover) { opacity: 1; }
			&:is(:active) { opacity: 0.6; }

			> svg {
				flex: 0 0 auto;
				width: 2em;
				height: 2em;
			}

			> em {
				position: absolute;
				margin: auto;
				inset: 0;
				top: 105%;
				flex: 0 0 auto;
				opacity: 0.3;
				text-align: center;
				font-size: 0.7em;
			}
		}
	}
`

