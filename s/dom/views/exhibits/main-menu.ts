
import {css, html, loading, wherefor} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {MatchmakingLiaison} from "../../../net/matchmaking-liaison.js"

type Options = {
	goIntro: () => void
	goFreeplay: () => void
	goMultiplayer: () => void
}

export const MainMenuView = nexus.shadowView(use => (o: Options) => {
	use.name("main-menu")
	use.styles(styles)

	const matchmaking = use.init(() => {
		const matchmaking = new MatchmakingLiaison(use.context.connectivity)
		return [matchmaking, () => matchmaking.dispose()]
	})

	use.mount(() => () => matchmaking.bail())

	return html`
		<h1>regis</h1>
		<div class=page>
			${MatchmakingButtonView(matchmaking)}
			<button @click=${o.goFreeplay}>freeplay</button>
			<button @click=${o.goIntro}>exit</button>
		</div>
		${loading.braille(use.context.connectivity.connection, connection =>
			wherefor(connection, ({report, ping}) => html`
				<ul class=connected>
					<li>status: ${report.clientStatus}</li>
					<li>players: ${report.worldStats.players}</li>
					<li>games: ${report.worldStats.games}</li>
					<li>games/hour: ${report.worldStats.gamesInLastHour}</li>
					<li>ping: ${ping} ms</li>
				</ul>
			`)
			?? html`
				<p class=disconnected>disconnected</p>
			`
		)}
	`
})

/////////////////////////////////////////

const styles = css``

/////////////////////////////////////////

export const MatchmakingButtonView = nexus.lightView(use => (matchmaking: MatchmakingLiaison) => {
	use.name("matchmaking-button")

	return loading.braille(matchmaking.situation, situation => {
		switch (situation.kind) {

			case "disconnected": return html`
				<p>disconnected</p>
			`

			case "unqueued": return html`
				<button
					class="matchmaking start"
					@click="${situation.startMatchmaking}">
						start matchmaking
				</button>
			`

			case "queued": return html`
				<button
					class="matchmaking cancel"
					@click="${situation.cancelMatchmaking}">
						cancel matchmaking
				</button>
			`
		}
	})
})

