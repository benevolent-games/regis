
import {html, Op} from "@benev/slate"
import {MatchmakingLiaison} from "../../../net/matchmaking-liaison.js"

export function renderMatchmakingButton(matchmaking: MatchmakingLiaison) {
	const situation = Op.payload(matchmaking.situation.value)

	if (!situation || situation.kind === "disconnected") return html`
		<button
			disabled
			class="naked matchmaking disconnected">
				Start Matchmaking
				${situation
					? html`<span class="errortag">not connected</span>`
					: null}
		</button>
	`

	else if (situation.kind === "unqueued") return html`
		<button
			class="naked matchmaking start"
			@click="${situation.startMatchmaking}">
				Start Matchmaking
		</button>
	`

	else if (situation.kind === "queued") return html`
		<button
			class="naked matchmaking cancel"
			@click="${situation.cancelMatchmaking}">
				Cancel Matchmaking
		</button>
	`
}

