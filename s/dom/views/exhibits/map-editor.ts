
import {css, html} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {UiView} from "../ui/view.js"
import {EditorCore, EditorPayload} from "../../../game/editor.js"

export const MapEditorView = nexus.shadowView(use => (p: EditorPayload) => {
	use.styles(styles)
	use.name("map-editor")

	use.init(() => {
		const core = new EditorCore(window, p)
		return [core, () => core.dispose()]
	})

	return html`
		<div class=easel>
			${p.canvas}
			${UiView([])}
		</div>
	`
})

export const styles = css`
	.easel {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		width: 100%;
		height: 100%;

		> * {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
		}
	}

	canvas {
		background: #222;
		outline: none;
	}
`

