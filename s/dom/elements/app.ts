
import {nexus} from "../nexus.js"
import styles from "./app.css.js"
import {MapEditorView} from "../views/map-editor.js"

export const TinyforgeApp = nexus.shadow_component(use => {
	use.styles(styles)

	return MapEditorView([])
})

