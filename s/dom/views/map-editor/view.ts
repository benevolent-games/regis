
import {html} from "@benev/slate"
import {Vista} from "@benev/toolbox"

import styles from "./css.js"
import {nexus} from "../../nexus.js"
import {UiView} from "../ui/view.js"
import {EditorCore} from "../../../game/editor.js"

export type MapEditorPayload = {
	vista: Vista
	editorCore: EditorCore
	dispose: () => void
}

export async function loadMapEditorPayload(): Promise<MapEditorPayload> {
	const canvas = document.createElement("canvas")
	const vista = new Vista({
		canvas,
		engine: await Vista.engine({
			canvas,
			webgl: {
				alpha: false,
				desynchronized: true,
				preserveDrawingBuffer: false,
				powerPreference: "high-performance",
			},
			webgpu: {
				antialias: true,
				audioEngine: true,
				powerPreference: "high-performance",
			},
		})
	})

	const editorCore = new EditorCore(window)
	const {inputs, actions, dispose} = editorCore

	inputs.on(actions.common.panUp, input => {
		console.log("panUp", input)
	})

	return {vista, editorCore, dispose}
}

export const MapEditorView = nexus.shadowView(use => (payload: MapEditorPayload) => {
	use.styles(styles)
	use.name("map-editor")

	const {vista} = payload

	return html`
		<div class=easel>
			${vista.canvas}
			${UiView([])}
		</div>
	`
})

