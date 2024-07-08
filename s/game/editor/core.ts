
import {Iron} from "@benev/toolbox"

import {EditorPayload} from "./types.js"
import {makeEditorInputs} from "./inputs.js"

export class EditorCore {

	static load = async(target: EventTarget) => {
		const canvas = document.createElement("canvas")
		const engine = await Iron.engine({
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

		const scaler = Iron.canvasScaler(canvas)
		const scene = Iron.scene({engine, background: [.1, .1, .1, 1]})
		const gameloop = Iron.gameloop(engine, [scene])
		const rendering = Iron.rendering(scene)

		function dispose() {
			gameloop.stop()
			scene.dispose()
			engine.dispose()
		}

		return new this(target, {
			canvas,
			scaler,
			engine,
			scene,
			gameloop,
			rendering,
			dispose,
		})
	}

	dispose: () => void
	inputs = makeEditorInputs()

	constructor(target: EventTarget, public readonly payload: EditorPayload) {
		const {inputs} = this

		const stop1 = inputs.on(inputs.actionCatalog.common.panUp, input => {
			console.log("panUp", input)
		})

		const stopInputs = inputs.listenForKeyboardEvents(target)

		this.dispose = () => {
			stop1()
			stopInputs()
			payload.dispose()
		}
	}
}

