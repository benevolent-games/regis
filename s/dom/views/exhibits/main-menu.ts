
import {css, html, loading} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {wherefor} from "../../../tools/wherefor.js"
import type {WorldStats} from "../../../director/director.js"

export const MainMenuView = nexus.shadowView(use => (o: Options) => {
	use.name("main-menu")
	use.styles(styles)

	const route = use.signal<keyof typeof pages>("/")
	const worldStats = use.signal<WorldStats | null>(null)
	const ping = use.signal<number | null>(null)

	use.mount(() => {
		let disabled = false

		async function query() {
			if (disabled)
				return undefined

			if (use.context.directorClient.isReady()) {
				const directorClient = use.context.directorClient.payload
				const start = Date.now()
				worldStats.value = await directorClient.serverside.getWorldStats()
				ping.value = Date.now() - start
			}

			setTimeout(query, 5_000)
		}

		query()

		return () => {
			disabled = true
			ping.value = null
		}
	})

	const pages = {
		"/": () => html`
			<button @click=${() => route.value = "/multiplayer"}>multiplayer</button>
			<button @click=${o.goEditor}>map editor</button>
			<button @click=${o.goIntro}>exit</button>
		`,

		"/multiplayer": () => MultiplayerMenuView({
			goBack: () => route.value = "/",
		}),
	}

	return html`
		<h1>regis</h1>
		<div class=page>
			${pages[route.value]()}
		</div>
		${wherefor(worldStats.value, stats => html`
			<ul>
				<li>games: ${stats.games}</li>
				<li>players: ${stats.players}</li>
				<li>${stats.gamesInLastHour} games/hour</li>
				<li>ping: ${ping} ms</li>
			</ul>
		`)}
		${loading.binary(use.context.directorClient, () => html`connected`)}
	`
})

/////////////////////////////////////////

type Options = {
	goIntro: () => void
	goEditor: () => void
}

const styles = css``

/////////////////////////////////////////

export const MultiplayerMenuView = nexus.lightView(use => (o: {
		goBack: () => void
	}) => {

	use.name("multiplayer-menu")
	const inQueue = use.op<boolean>()

	use.once(() => {
		inQueue.setReady(false)
	})

	use.mount(() => use.context.connectivity.connectionLost(() => {
		inQueue.setReady(false)
	}))

	const backButton = html`
		<button @click=${o.goBack}>back</button>
	`

	if (!use.context.directorClient.payload)
		return html`
			<p>not connected</p>
			${backButton}
		`

	const {serverside} = use.context.directorClient.payload

	function startMatchmaking() {
		inQueue.load(async() => {
			await serverside.matchmaking.joinQueue()
			return true
		})
	}

	function stopMatchmaking() {
		inQueue.load(async() => {
			await serverside.matchmaking.leaveQueue()
			return false
		})
	}

	return html`
		${loading.binary(inQueue, queued => queued ? html`
			<button @click=${stopMatchmaking}>stop matchmaking</button>
		` : html`
			<button @click=${startMatchmaking}>start matchmaking</button>
		`)}
		${backButton}
	`
})

