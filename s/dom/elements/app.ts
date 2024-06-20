
import {html} from "@benev/slate"

import {nexus} from "../nexus.js"
import {styles} from "./app.css.js"

export const TinyforgeApp = nexus.shadow_component(use => {
	use.styles(styles)

	return html`
		<h1>TINYFORGE</h1>
	`
})

