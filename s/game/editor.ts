
import {ev} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {AnyEngine, CanvasScaler, Gameloop, Iron, Rendering} from "@benev/toolbox"

import {Device, Inputs} from "./inputs.js"
import {editorActions, editorActionsList} from "./editor-inputs.js"

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
	static load = async(): Promise<EditorPayload> => {
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

		return {
			canvas,
			scaler,
			engine,
			scene,
			gameloop,
			rendering,
			dispose,
		}
	}

	dispose: () => void

	inputs = new Inputs()
	actions = editorActions

	constructor(target: EventTarget, public readonly payload: EditorPayload) {
		const device = new Device(this.inputs, editorActionsList)

		this.inputs.on(this.actions.common.panUp, input => {
			console.log("panUp", input)
		})

		const stopInputs = ev(target, {
			keyup: device.keyup,
			keydown: device.keydown,
		})

		this.dispose = () => {
			stopInputs()
			payload.dispose()
		}
	}
}

