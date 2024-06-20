
import {html} from "@benev/slate"

import {nexus} from "../nexus.js"
import styles from "./map-editor.css.js"

export const MapEditor = nexus.shadow_view(use => () => {
	use.styles(styles)

	return html`
		<div class="easel">
			<canvas></canvas>
			<div class="sidebar alpha"></div>
			<div class="sidebar bravo"></div>
		</div>
	`
})

