
import {css, ev, html, loading, wherefor} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {Connectivity} from "../../../net/connectivity.js"
import {ConnectionTray} from "./connection-tray.js"

import antennaBars5Svg from "../../icons/tabler/antenna-bars-5.svg.js"
import antennaBars4Svg from "../../icons/tabler/antenna-bars-4.svg.js"
import antennaBars3Svg from "../../icons/tabler/antenna-bars-3.svg.js"
import antennaBars2Svg from "../../icons/tabler/antenna-bars-2.svg.js"
import antennaBars1Svg from "../../icons/tabler/antenna-bars-1.svg.js"
import antennaBarsOffSvg from "../../icons/tabler/antenna-bars-off.svg.js"

export const StatusBuddyView = nexus.shadowView(use => (connectivity: Connectivity) => {
	use.name("status-buddy")
	use.styles(styles)

	const opened = use.signal(false)

	const toggle = () => {
		opened.value = !opened.value
	}

	use.mount(() => ev(document, {
		pointerdown: (event: PointerEvent) => {
			const {element} = use
			const path = event.composedPath()
			const clickedOutside = !path.includes(element)
			if (clickedOutside)
				opened.value = false
		},
	}))

	return html`
		<button class="mainbutton naked flashy" @click="${toggle}" ?data-opened="${opened}">
			${loading.braille(connectivity.connection, connection =>
				wherefor(connection, ({ping}) => (
					(ping < 50) ? html`<span class=icon>${antennaBars5Svg}</span>`
					: (ping < 150) ? html`<span class=icon>${antennaBars4Svg}</span>`
					: (ping < 400) ? html`<span class=icon>${antennaBars3Svg}</span>`
					: html`<span class=icon>${antennaBars2Svg}</span>`
				))
				?? html`
					<span class="icon angry">${antennaBarsOffSvg}</span>
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
	--coolcolor: #141a2899;
}

button.mainbutton {
	display: block;
	width: 100%;
	height: 100%;

	border-radius: 0.2em;
	cursor: pointer;

	&:hover {
		background: var(--coolcolor);
	}

	&[data-opened] {
		background: var(--coolcolor);
		box-shadow: 0.1em 0.2em 0.3em #0002;
	}

	& .icon {
		&.angry { color: red; }

		& svg {
			width: 100%;
			height: 100%;
		}
	}
}

[view="connection-tray"] {
	position: absolute;
	width: 24em;
	top: 110%;
	right: 0;

	padding: 1em;

	background: var(--coolcolor);
	backdrop-filter: blur(0.5em);
	box-shadow: 0.1em 0.2em 0.3em #0002;
	border-radius: 0.3em;

	font-family: sans-serif;
	text-shadow: 0.04em 0.08em 0.1em #0008;
}

`

