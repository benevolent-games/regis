
import {css, html} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {ClockView} from "./clock.js"
import {Bridge} from "../../utils/bridge.js"
import xSvg from "../../icons/tabler/x.svg.js"
import {constants} from "../../../constants.js"
import menuSvg from "../../icons/tabler/menu.svg.js"
import {FullTeamInfo} from "../../../logic/state.js"
import circleCheckSvg from "../../icons/tabler/circle-check.svg.js"
import arrowCounterClockwiseSvg from "../../icons/akar/arrow-counter-clockwise.svg.js"

export const ActionBarView = nexus.shadowView(use => (
		bridge: Bridge
	) => {

	use.name("actionbar")
	use.styles(styles)

	const agent = bridge.agent.value
	const teamId = bridge.teamId.value
	const actions = bridge.terminal.actions

	const {income} = agent.claims.teamIncome(teamId)
	const ourTurn = agent.activeTeamId === teamId
	const turnCount = agent.state.context.turnCount
	const myTeam = agent.state.teams.at(teamId)! as FullTeamInfo

	return html`
		<div class="chunk stretchy left">
			<div class="entry">
				<div class="button">
					${menuSvg}
					<em>tab</em>
				</div>
			</div>

			<div class="cycles">
				cycle ${Math.floor(turnCount / 2) + 1}
			</div>

			<div class="splitter"></div>

			<div class="entry" ?data-disabled="${!ourTurn}" hidden>
				<div class="button">
					${arrowCounterClockwiseSvg}
					<em>z</em>
				</div>
			</div>

			<div class="entry" ?data-disabled="${!ourTurn}">
				<div class="button" @click="${actions.resetPreview}">
					${xSvg}
					<em>ctrl-z</em>
				</div>
			</div>
		</div>

		<div class="chunk static">
			${ClockView([bridge])}
		</div>

		<div class="chunk stretchy right">
			<div class="entry" ?data-disabled="${!ourTurn}">
				<div class="button juicy" @click="${actions.commitTurn}">
					${circleCheckSvg}
					<em>spacebar</em>
				</div>
			</div>

			<div class="splitter"></div>

			<div class="resources">
				<span class=value>
					${constants.icons.resource}${myTeam.resources}
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

		align-items: stretch;
		&.left { justify-content: end; }
		&.right { justify-content: start; }

		&.static { flex: 0 0 auto; }
		&.stretchy { flex: 1 1 0; }

		&.corner {
			flex: 0 1 auto;
			min-width: 8em;
			&:last-child { justify-content: end; }
		}

		> .splitter { width: 0; }
		&.left > .splitter { margin-right: auto; }
		&.right > .splitter { margin-left: auto; }
	}

	.cycles {
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: monospace;
		opacity: 0.5;
		height: 3em;
	}

	.resources {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		font-family: monospace;
		font-weight: bold;
		height: 3em;
		padding: 0 1em;

		> .value { font-size: 2em; }
		> .income { font-size: 1.25em; opacity: 0.5; }
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
				font-style: normal;
			}
		}
	}
`

