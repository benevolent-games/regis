
import {css, html, loading, wherefor} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {Connectivity} from "../../../net/connectivity.js"
import {ConnectionTray} from "./connection-tray.js"

export const StatusBuddyView = nexus.shadowView(use => (connectivity: Connectivity) => {
	use.name("status-buddy")
	use.styles(styles)

	const opened = use.signal(false)

	const toggle = () => {
		opened.value = !opened.value
	}

	return html`
		<button class="mainbutton naked flashy" @click="${toggle}" ?data-opened="${opened}">
			${loading.braille(connectivity.connection, connection =>
				wherefor(connection, ({ping}) => html`
					${(ping < 100)
						? html`<span>📶</span>`
						: html`<span>🐢</span>`}
				`)
				?? html`
					<span>⛔</span>
				`
			)}
		</button>

		${opened.value
			? ConnectionTray([connectivity])
			: null}
	`
})

const styles = css`

:host {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
}

button.mainbutton {
	display: block;
	width: 100%;
	height: 100%;

	background: #aaa4;
	box-shadow: 0.1em 0.2em 0.3em #0002;
	border-radius: 0.2em;
	cursor: pointer;

	&[data-opened] {
		background: #eee8;
	}
}

[view="connection-tray"] {
	position: absolute;
	width: 24em;
	top: 110%;
	right: 0;

	padding: 1em;

	background: #fff4;
	backdrop-filter: blur(0.5em);
	box-shadow: 0.1em 0.2em 0.3em #0002;
	border-radius: 0.3em;
}

`

