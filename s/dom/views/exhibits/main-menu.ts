
import {css, html, loading, Op, wherefor} from "@benev/slate"

import {nexus} from "../../nexus.js"

type Options = {
	goIntro: () => void
	goFreeplay: () => void
	goMultiplayer: () => void
}

export const MainMenuView = nexus.shadowView(use => (o: Options) => {
	use.name("main-menu")
	use.styles(styles)

	use.mount(() => () => use.context.matchmaking.bail())

	return html`
		<h1>regis</h1>
		<div class=page>
			${MatchmakingButtonView()}
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

export const MatchmakingButtonView = nexus.lightView(use => () => {
	use.name("matchmaking-button")
	const {matchmaking} = use.context

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

	// const ready = use.op<void>()
	// const composite = Op.all(connectivity.directorClient.value, ready.value)
	// const isQueued = reporting.info.value?.report.clientStatus === "queued"
	//
	// use.once(() => ready.setReady())
	//
	// if (Op.is.error(connectivity.directorClient.value))
	// 	return html`offline`
	//
	// return loading.braille(composite, ([client]) => {
	// 	const {serverside} = client
	//
	// 	function start() {
	// 		ready.load(async() => {
	// 			await serverside.matchmaking.joinQueue()
	// 			await reporting.query()
	// 		})
	// 	}
	//
	// 	function cancel() {
	// 		ready.load(async() => {
	// 			await serverside.matchmaking.leaveQueue()
	// 			await reporting.query()
	// 		})
	// 	}
	//
	// 	return isQueued
	// 		? html`
	// 			<button
	// 				class="matchmaking cancel"
	// 				@click="${cancel}">
	// 					cancel matchmaking
	// 			</button>
	// 		`
	// 		: html`
	// 			<button
	// 				class="matchmaking start"
	// 				@click="${start}">
	// 					start matchmaking
	// 			</button>
	// 		`
	// })
})

