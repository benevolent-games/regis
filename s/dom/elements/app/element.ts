
import styles from "./css.js"
import {nexus} from "../../nexus.js"
import {MapEditorView} from "../../views/map-editor/view.js"

export const TinyforgeApp = nexus.shadow_component(use => {
	use.styles(styles)
	return MapEditorView([])
})

