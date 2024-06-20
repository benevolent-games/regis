
import {html} from "@benev/slate"

import {nexus} from "../nexus.js"
import styles from "./map-editor.css.js"
import {Editor, editing} from "../../game/editor.js"
import {Bestorage, EffectsPanelData, Stage, op_effect} from "@benev/toolbox"

export const MapEditorView = nexus.shadow_view(use => () => {
	use.styles(styles)
	use.name("map-editor")

	const goods = use.op<{
		stage: Stage,
		editor: Editor,
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
			const editor = await editing(stage)
			return {stage, editor}
		})
	})

	return html`
		<div class="easel">
			${op_effect.binary(goods.value, ({stage}) => html`
				${stage.porthole.canvas}
				<div class="sidebar alpha"></div>
				<div class="sidebar bravo"></div>
			`)}
		</div>
	`
})

