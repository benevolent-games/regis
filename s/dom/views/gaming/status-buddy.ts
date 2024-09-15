
import {css, html, loading, wherefor} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {Connectivity} from "../../../net/connectivity.js"

export const StatusBuddyView = nexus.shadowView(use => (connectivity: Connectivity) => {
	use.name("status-buddy")
	use.styles(styles)
	
	return loading.braille(connectivity.connection, connection =>
		wherefor(connection, ({report, ping}) => html`
			${(ping < 100)
				? html`<span>📶</span>`
				: html`<span>🐢</span>`}
		`)
		?? html`
			<span>⛔</span>
		`
	)
})

// <ul class=connected>
// 	<li>status: ${report.personStatus}</li>
// 	<li>players: ${report.worldStats.players}</li>
// 	<li>games: ${report.worldStats.games}</li>
// 	<li>games/hour: ${report.worldStats.gamesInLastHour}</li>
// 	<li>ping: ${ping} ms</li>
// </ul>

const styles = css`

:host {
	display: flex;
	justify-content: center;
	align-items: center;
}

`

