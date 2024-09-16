
import {css, html} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {StatusBuddyView} from "../gaming/status-buddy.js"
import {InitialMemo} from "../../../director/apis/clientside.js"
import {renderMatchmakingButton} from "../gaming/matchmaking-button.js"
import {MatchmakingLiaison} from "../../../net/matchmaking-liaison.js"

type Options = {
	goFreeplay: () => void
	goVersus: (memo: InitialMemo) => void
}

export const MainMenuView = nexus.shadowView(use => (o: Options) => {
	use.name("main-menu")
	use.styles(styles)
	const {connectivity} = use.context

	const matchmaking = use.init(() => {
		const matchmaking = new MatchmakingLiaison(connectivity)
		return [matchmaking, () => matchmaking.dispose()]
	})

	use.mount(() => () => matchmaking.bail())
	use.mount(() => connectivity.machinery.onGameInitialize(memo => o.goVersus(memo)))

	return html`
		<slot></slot>

		<div class=quickbar>
			${StatusBuddyView([use.context.connectivity])}
		</div>

		<nav>
			${renderMatchmakingButton(matchmaking)}

			<button class=naked @click=${o.goFreeplay}>
				Freeplay
			</button>

			<a target="_blank" href="https://github.com/benevolent-games/regis/wiki">
				Learn More
			</a>
		</nav>
	`
})

const styles = css`

:host {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: auto;

	display: flex;
	flex-direction: column;

	font-family: Spectre, serif;
}

.quickbar {
	position: absolute;

	top: 0;
	left: 0;
	right: 0;

	display: flex;
	justify-content: end;
	padding: 1em;
	gap: 0.5em;

	> * {
		width: 2em;
		height: 2em;
	}
}

nav {
	flex: 1 1 auto;

	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2em;

	--anim-duration: 100ms;

	> :is(a, button) {
		font-size: 2em;
		position: relative;
		cursor: pointer;

		text-decoration: none !important;
		text-shadow: 0 0 0.4em #000a;
		transition: text-shadow var(--anim-duration) linear;

		&::after {
			pointer-events: none;
			opacity: 0;
			transition: opacity var(--anim-duration) linear;
			display: block;
			content: "";
			position: absolute;
			bottom: -15%;
			left: -10%;
			right: -10%;
			height: 0.05em;
			background: linear-gradient(
				to right,
				#fff0,
				#ffff,
				#fff0
			);
		}

		.errortag {
			pointer-events: none;
			position: absolute;
			bottom: 90%;
			right: -20%;
			font-size: 0.4em;
			font-family: sans-serif;
			padding: 0 0.5em;
		}

		&[disabled] {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&:not([disabled]) {
			&:hover {
				text-shadow: 0 0 0.4em #fff6;
				&::after { opacity: 0.5; }
			}
			&:active {
				color: #80beff;
			}
		}
	}
}

`

