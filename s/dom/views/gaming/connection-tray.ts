
import {css, html, loading, wherefor} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {PersonStatus} from "../../../director/types.js"
import {Connection, Connectivity} from "../../../net/connectivity.js"

export const ConnectionTray = nexus.shadowView(use => (connectivity: Connectivity) => {
	use.name("connection-tray")
	use.styles(styles)

	function renderDisconnected() {
		return html`
			<section class=disconnected>
				<h1>Connection failed 😢</h1>
				<p>Something's wrong with your connection to the gameplay server.</p>
				<div class=buttons>
					<button
						class="based flashy"
						@click="${() => connectivity.connect()}">
							Attempt Reconnect
					</button>
				</div>
			</section>
		`
	}

	function renderBasicStats({ping, report}: Connection) {
		return html`
			<ul class=connected>
				<li>
					<span>Ping:</span>
					<span>${ping} ms</span>
				</li>
				<li>
					<span>Your status:</span>
					<span>${report.personStatus}</span>
				</li>
				<li>
					<span>Players online:</span>
					<span>${report.worldStats.players}</span>
				</li>
				<li>
					<span>Ongoing 1v1s:</span>
					<span>${report.worldStats.games}</span>
				</li>
				<li>
					<span>Matches made in last 60 minutes:</span>
					<span>${report.worldStats.gamesInLastHour}</span>
				</li>
			</ul>
		`
	}

	function renderSituationally(personStatus: PersonStatus) {
		if (personStatus === "queued") return html`
			<div class=queued>
				<h1>You are in the matchmaking queue.</h1>
				<p>A 1v1 match will start when another player joins the queue.</p>
			</div>
		`
	}
	
	return loading.braille(connectivity.connection, connection =>
		wherefor(connection, connection => html`
			${renderSituationally(connection.report.personStatus)}
			${renderBasicStats(connection)}
		`)
		?? renderDisconnected()
	)
})

const styles = css`

:host {
	display: flex;
	flex-direction: column;
	gap: 1em;
}

ul {
	list-style: none;
	display: flex;
	flex-direction: column;
	gap: 0.5em;
}

li {
	display: flex;
	gap: 1em;

	& > span:nth-child(2) {
		font-family: monospace;
		margin-left: auto;
	}
}

.queued {
	h1 { font-size: 1.1em; }
	> * + * { margin-top: 1em; }
}

.disconnected {
	h1 { font-size: 1.1em; }
	> * + * { margin-top: 1em; }

	.buttons {
		display: flex;
		justify-content: end;
		& button {
			font-weight: bold;
			font-variant: small-caps;
		}
	}
}

`

