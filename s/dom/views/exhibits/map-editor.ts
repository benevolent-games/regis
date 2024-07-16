//
// import {css, html} from "@benev/slate"
//
// import {nexus} from "../../nexus.js"
// import {UiView} from "../ui/view.js"
// import {EditorCore} from "../../../game/editor/core.js"
//
// export const MapEditorView = nexus.shadowView(use => (editorCore: EditorCore) => {
// 	use.styles(styles)
// 	use.name("map-editor")
//
// 	return html`
// 		<div class=easel>
// 			${editorCore.payload.canvas}
// 			${UiView([editorCore])}
// 		</div>
// 	`
// })
//
// export const styles = css`
// 	.easel {
// 		display: flex;
// 		justify-content: center;
// 		align-items: center;
// 		position: relative;
// 		width: 100%;
// 		height: 100%;
//
// 		> * {
// 			position: absolute;
// 			inset: 0;
// 			width: 100%;
// 			height: 100%;
// 		}
// 	}
//
// 	canvas {
// 		background: #222;
// 		outline: none;
// 	}
// `
//
