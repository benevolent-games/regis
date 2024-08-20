
import {css, html, loading, Op, opSignal, wherefor} from "@benev/slate"

import {nexus} from "../../nexus.js"
// import {wherefor} from "../../../tools/wherefor.js"

type Options = {
	goIntro: () => void
	goEditor: () => void
}

export const MainMenuView = nexus.shadowView(use => (o: Options) => {
	use.name("main-menu")
	use.styles(styles)

	const route = use.signal<keyof typeof pages>("/")

	const pages = {
		"/": () => html`
			${MatchmakingButtonView()}
			<button @click=${o.goEditor}>map editor</button>
			<button @click=${o.goIntro}>exit</button>
		`,

		// "/multiplayer": () => MultiplayerMenuView({
		// 	goBack: () => route.value = "/",
		// }),
	}

	const {info} = use.context.connectivity.reporting

	return html`
		<h1>regis</h1>
		<div class=page>
			${pages[route.value]()}
		</div>
		${wherefor(info, ({ping, report: {worldStats, clientStatus}}) => html`
			<ul class=connected>
				<li>status: ${clientStatus}</li>
				<li>players: ${worldStats.players}</li>
				<li>games: ${worldStats.games}</li>
				<li>games/hour: ${worldStats.gamesInLastHour}</li>
				<li>ping: ${ping} ms</li>
			</ul>
		`) ?? html`<p class=disconnected>disconnected</p>`}
	`
})

/////////////////////////////////////////

const styles = css``

/////////////////////////////////////////

export class MatchmakingUi {

}

export const MatchmakingButtonView = nexus.lightView(use => () => {
	use.name("matchmaking-button")

	const {connectivity} = use.context
	const {reporting} = connectivity

	const ready = use.op<void>()
	const composite = Op.all(connectivity.directorClient.value, ready.value)
	const isQueued = reporting.info.value?.report.clientStatus === "queued"

	use.once(() => ready.setReady())

	if (Op.is.error(connectivity.directorClient.value))
		return html`offline`

	return loading.braille(composite, ([client]) => {
		const {serverside} = client

		function start() {
			ready.load(async() => {
				await serverside.matchmaking.joinQueue()
				await reporting.query()
			})
		}

		function stop() {
			ready.load(async() => {
				await serverside.matchmaking.leaveQueue()
				await reporting.query()
			})
		}

		return isQueued
			? html`
				<button
					class="matchmaking stop"
					@click="${stop}">
						stop matchmaking
				</button>
			`
			: html`
				<button
					class="matchmaking start"
					@click="${start}">
						start matchmaking
				</button>
			`
	})
})

// export const MultiplayerMenuView = nexus.lightView(use => (o: {
// 		goBack: () => void
// 	}) => {
//
// 	use.name("multiplayer-menu")
//
// 	const available = use.op<void>()
// 	const {connectivity} = use.context
//
// 	function updateAvailability() {
// 		if (connectivity.isConnected)
// 			available.setReady()
// 		else
// 			available.setLoading()
// 	}
//
// 	const isQueued = connectivity.reporting.info.value?.report.clientStatus === "queued"
// 	const isAvailable = available.isReady()
//
// 	use.once(() => updateAvailability())
// 	use.mount(() => connectivity.connectionLost(updateAvailability))
// 	use.mount(() => connectivity.connectionEstablished(updateAvailability))
//
// 	const backButton = html`
// 		<button @click=${o.goBack}>back</button>
// 	`
//
// 	if (!use.context.directorClient.payload)
// 		return html`
// 			<p>not connected</p>
// 			${backButton}
// 		`
//
// 	const {serverside} = use.context.directorClient.payload
// 	const {reporting} = use.context.connectivity
//
// 	function startMatchmaking() {
// 		available.load(async() => {
// 			await serverside.matchmaking.joinQueue()
// 			await reporting.query()
// 		})
// 	}
//
// 	function stopMatchmaking() {
// 		available.load(async() => {
// 			await serverside.matchmaking.leaveQueue()
// 			await reporting.query()
// 		})
// 	}
//
// 	return html`
// 		${loading.binary(available, queued => queued ? html`
// 			<button @click=${stopMatchmaking}>stop matchmaking</button>
// 		` : html`
// 			<button @click=${startMatchmaking}>start matchmaking</button>
// 		`)}
// 		${backButton}
// 	`
// })

