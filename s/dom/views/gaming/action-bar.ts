
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

export const ActionBarView = nexus.shadowView(use => ({
		bridge,
		openMenu,
	}: {
		bridge: Bridge
		openMenu: () => void
	}) => {

	use.name("actionbar")
	use.styles(styles)

	const agent = bridge.agent.value
	const teamId = bridge.teamId.value
	const actions = bridge.terminal.actions

	const {income} = agent.claims.teamIncome(teamId)
	const ourTurn = agent.activeTeamId === teamId
	const turnCount = agent.state.context.turnCount
	const myTeam = agent.state.teams.at(teamId)! as FullTeamInfo

	function gameover() {
		const conclusion = agent.conclusion!
		const victory = conclusion.winnerTeamId === teamId
		return html`
			<div class=gameover ?data-victory="${victory}">
				${victory
					? html`<h1>Victory</h1>`
					: html`<h1>Defeat</h1>`}
			</div>
		`
	}

	function gameplay() {
		return html`
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

			${ClockView([bridge])}

			<div class="entry" ?data-disabled="${!ourTurn}">
				<div class="button juicy" @click="${actions.commitTurn}">
					${circleCheckSvg}
					<em>spacebar</em>
				</div>
			</div>
		`
	}

	return html`
		<div class="chunk static">
			<div class="entry">
				<div class="button" @click="${openMenu}">
					${menuSvg}
					<em>tab</em>
				</div>
			</div>
		</div>

		<div class="chunk stretch">
			<div class="cycles">
				cycle ${Math.floor(turnCount / 2) + 1}
			</div>
		</div>

		<div class="chunk static">
			${agent.conclusion ? gameover() : gameplay()}
		</div>

		<div class="chunk stretch"></div>

		<div class="chunk static">
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
	gap: 0.5em;

	&.static { flex: 0 0 auto; }
	&.stretch { flex: 1 1 auto; }
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

