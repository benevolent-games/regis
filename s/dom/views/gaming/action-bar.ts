
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

	const income = uiData.income.value
	const ourTurn = uiData.ourTurn.value
	const resources = uiData.resources.value

	return html`
		<div class="corner chunk static">
			<div class="entry">
				<div class="button">
					${menuSvg}
					<em>tab</em>
				</div>
			</div>
		</div>

		<div class="chunk stretchy left">
			<div class="entry" hidden ?data-disabled="${!ourTurn}">
				<div class="button">
					${arrowCounterClockwiseSvg}
					<em>z</em>
				</div>
			</div>

			<div class="entry" ?data-disabled="${!ourTurn}">
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
			<div class="entry" ?data-disabled="${!ourTurn}">
				<div class="button juicy">
					${circleCheckSvg}
					<em>spacebar</em>
				</div>
			</div>
		</div>

		<div class="corner chunk static">
			<div class="resources">
				<span class=value>
					💎${resources}
				</span>
				<span class=income>
					+${income}
				</span>
			</div>
		</div>
	`
})

export const styles = css`
	:host {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;
		user-select: none;
	}

	.chunk > * {
		pointer-events: all;
	}

	.chunk {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;

		align-items: start;
		&.left { justify-content: end; }
		&.right { justify-content: start; }

		&.static { flex: 0 0 auto; }
		&.stretchy { flex: 1 1 0; }

		&.corner {
			flex: 0 1 auto;
			min-width: 8em;
			&:last-child { justify-content: end; }
		}
	}

	.resources {
		display: flex;
		flex-direction: column;
		align-items: end;
		justify-content: center;

		font-family: monospace;
		height: 3em;
		padding: 0 1em;

		> .value { font-size: 1.5em; }
		> .income { font-size: 1em; }
	}

	.entry {
		display: flex;
		flex-direction: column;

		> * { flex: 1 0 auto; }

		&[hidden] { display: none; }

		transition: opacity 150ms linear;
		opacity: 1;
		&[data-disabled] {
			opacity: 0;
			pointer-event: none;
		}

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
			backdrop-filter: blur(10px);
			&.juicy { background: #2a0a; }

			filter: brightness(100%);
			&:is(:hover) { filter: brightness(120%); }
			&:is(:active) { filter: brightness(140%); }

			> svg {
				flex: 0 0 auto;
				width: 2em;
				height: 2em;
			}

			> em {
				pointer-events: none;
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

