
import {css, html} from "@benev/slate"

import {nexus} from "../../nexus.js"
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
		<nav>
			${renderMatchmakingButton(matchmaking)}
			<button class=naked @click=${o.goFreeplay}>
				freeplay
			</button>
		</nav>
	`
})

		// <div class=page>
		// 	<button @click=${o.goFreeplay}>freeplay</button>
		//
		// 	${MatchmakingButtonView(matchmaking)}
		//
		// 	${loading.braille(use.context.connectivity.connection, connection =>
		// 		wherefor(connection, ({report, ping}) => html`
		// 			<ul class=connected>
		// 				<li>status: ${report.personStatus}</li>
		// 				<li>players: ${report.worldStats.players}</li>
		// 				<li>games: ${report.worldStats.games}</li>
		// 				<li>games/hour: ${report.worldStats.gamesInLastHour}</li>
		// 				<li>ping: ${ping} ms</li>
		// 			</ul>
		// 		`)
		// 		?? html`
		// 			<p class=disconnected>disconnected</p>
		// 		`
		// 	)}
		// </div>

/////////////////////////////////////////

const styles = css`

:host {
	width: 100%;
	height: 100%;
	overflow: auto;

	display: flex;
	flex-direction: column;

	font-family: Spectre, serif;
}

nav {
	flex: 1 1 auto;

	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2em;

	--anim-duration: 100ms;

	> button {
		font-size: 2em;
		position: relative;
		cursor: pointer;

		text-shadow: 0 0 0.4em #000a;
		transition: text-shadow var(--anim-duration) linear;

		&::after {
			opacity: 0;
			transition: opacity var(--anim-duration) linear;
			pointer-events: none;
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
			position: absolute;
			bottom: 90%;
			right: -20%;
			font-size: 0.4em;
			font-family: sans-serif;
			color: red;
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

