
import {css, html, Signal} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {Porthole} from "../../utils/porthole.js"

export const InspectorView = nexus.shadowView(use => (
		porthole: Signal<Porthole>,
	) => {

	use.name("actionbar")
	use.styles(styles)

	const {actions} = porthole.value

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

