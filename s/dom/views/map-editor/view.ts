
import {html, loading} from "@benev/slate"

import styles from "./css.js"
import {nexus} from "../../nexus.js"
import {UiView} from "../ui/view.js"
import {EditorCore} from "../../../game/editor.js"
import {Bestorage, EffectsPanelData, Stage} from "@benev/toolbox"

export const MapEditorView = nexus.shadowView(use => () => {
	use.styles(styles)
	use.name("map-editor")

	const goods = use.op<{
		stage: Stage,
		editorCore: EditorCore
	}>()

	use.once(async() => {
		await goods.load(async() => {

			const stage = await Stage.create({
				background: Stage.backgrounds.black(),
				allow_webgpu: false,
				webgl_options: {
					alpha: false,
					desynchronized: true,
					preserveDrawingBuffer: false,
					powerPreference: "high-performance",
				},
				webgpu_options: {
					antialias: true,
					audioEngine: true,
					powerPreference: "high-performance",
				},
				bestorage: new Bestorage<EffectsPanelData>({
					effects: {},
					resolution: 100,
				}),
			})

			const editorCore = new EditorCore(window)
			const {inputs, actions} = editorCore

			inputs.on(actions.common.panUp, input => {
				console.log("panUp", input)
			})

			return {stage, editorCore}
		})
	})

	return html`
		<div class="easel">
			${op_effect.binary(goods.value, ({stage}) => html`
				${stage.porthole.canvas}
				${UiView([])}
			`)}
		</div>
	`
})

