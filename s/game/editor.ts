
import {ev} from "@benev/slate"
import {Device, Inputs} from "./inputs.js"
import {editorActions, editorActionsList} from "./editor-inputs.js"

export class EditorCore {
	dispose: () => void
	inputs = new Inputs()
	actions = editorActions

	constructor(target: EventTarget) {
		const device = new Device(this.inputs, editorActionsList)

		this.dispose = ev(target, {
			keyup: device.keyup,
			keydown: device.keydown,
		})
	}
}

