
import {css, html, loading, wherefor} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {Connectivity} from "../../../net/connectivity.js"

export const ConnectionTray = nexus.shadowView(use => (connectivity: Connectivity) => {
	use.name("connection-tray")
	use.styles(styles)
	
	return loading.braille(connectivity.connection, connection =>
		wherefor(connection, ({report, ping}) => html`
			<ul class=connected>
				<li>status: ${report.personStatus}</li>
				<li>players: ${report.worldStats.players}</li>
				<li>games: ${report.worldStats.games}</li>
				<li>games/hour: ${report.worldStats.gamesInLastHour}</li>
				<li>ping: ${ping} ms</li>
			</ul>
		`)
		?? html`
			<div>not connected</div>
			<div>
				<button @click="${() => connectivity.connect()}">reconnect</button>
			</div>
		`
	)
})

const styles = css`

:host {
	display: block;
}

`

