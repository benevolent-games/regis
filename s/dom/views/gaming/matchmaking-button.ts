
import {html, loading} from "@benev/slate"
import {MatchmakingLiaison} from "../../../net/matchmaking-liaison.js"

export function renderMatchmakingButton(matchmaking: MatchmakingLiaison) {
	return loading.braille(matchmaking.situation, situation => {
		switch (situation.kind) {

			case "disconnected": return html`
				<button
					disabled
					class="naked matchmaking disconnected">
						Start Matchmaking
						<span class="errortag">
							not connected
						</span>
				</button>
			`

			case "unqueued": return html`
				<button
					class="naked matchmaking start"
					@click="${situation.startMatchmaking}">
						Start Matchmaking
				</button>
			`

			case "queued": return html`
				<button
					class="naked matchmaking cancel"
					@click="${situation.cancelMatchmaking}">
						Cancel Matchmaking
				</button>
			`
		}
	})
}

