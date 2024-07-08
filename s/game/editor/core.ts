
import {Scene} from "@babylonjs/core/scene.js"
import {AnyEngine, CanvasScaler, Gameloop, Iron, Rendering} from "@benev/toolbox"

import {makeEditorInputs} from "./inputs.js"

export type EditorPayload = {
	canvas: HTMLCanvasElement
	scaler: CanvasScaler
	engine: AnyEngine
	scene: Scene
	gameloop: Gameloop
	rendering: Rendering
	dispose: () => void
}

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

		const payload: EditorPayload = {
			canvas,
			scaler,
			engine,
			scene,
			gameloop,
			rendering,
			dispose,
		}

		return new this(target, payload)
	}

	dispose: () => void
	inputs = makeEditorInputs()

	constructor(target: EventTarget, public readonly payload: EditorPayload) {
		const {inputs} = this

		const stop1 = inputs.on(inputs.catalog.common.panUp, input => {
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

