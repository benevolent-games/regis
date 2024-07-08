
import {Scene} from "@babylonjs/core"
import {AnyEngine, CanvasScaler, Gameloop, Rendering} from "@benev/toolbox"

export type EditorPayload = {
	canvas: HTMLCanvasElement
	scaler: CanvasScaler
	engine: AnyEngine
	scene: Scene
	gameloop: Gameloop
	rendering: Rendering
	dispose: () => void
}

