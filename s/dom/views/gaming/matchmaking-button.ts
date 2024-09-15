
import {html, loading} from "@benev/slate"
import {MatchmakingLiaison} from "../../../net/matchmaking-liaison.js"

export function renderMatchmakingButton(matchmaking: MatchmakingLiaison) {
	return loading.braille(matchmaking.situation, situation => {
		switch (situation.kind) {

			case "disconnected": return html`
				<button
					disabled
					class="naked matchmaking disconnected">
						start matchmaking
						<span class="errortag">connection error</span>
				</button>
			`

			case "unqueued": return html`
				<button
					class="naked matchmaking start"
					@click="${situation.startMatchmaking}">
						start matchmaking
				</button>
			`

			case "queued": return html`
				<button
					class="naked matchmaking cancel"
					@click="${situation.cancelMatchmaking}">
						cancel matchmaking
				</button>
			`
		}
	})
}

