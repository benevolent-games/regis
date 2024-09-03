
import {css, html} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {Bridge} from "../../utils/bridge.js"

export const InspectorView = nexus.shadowView(use => (
		bridge: Bridge
	) => {

	use.name("actionbar")
	use.styles(styles)

	return html`
		<div></div>
	`
})

export const styles = css`
	:host {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;
		user-select: none;
	}
`

