
import {Tact} from "@benev/toolbox"

export const mapEditorModes = {
	terrain: {},
}

export const editorBindings = () => Tact.bindings(({mode, buttons, b}) => ({
	terrain: mode({
		vectors: {},
		buttons: {
			select: buttons(b("Space")),
			zoom: buttons(b("Space")),
		},
	}),
}))

export type EditorBindings = ReturnType<typeof editorBindings>

export class EditorTact extends Tact<EditorBindings> {
	connectedDevices = {
		keyboard: new EditorTact.devices.Keyboard(window),
		mouse: new EditorTact.devices.PointerMovements(window, "mouse"),
		mouseButtons: new EditorTact.devices.MouseButtons(window),
	}

	constructor() {
		super(window, editorBindings())

		for (const device of Object.values(this.connectedDevices))
			this.devices.add(device)

		// this.modes.assign("common")
	}
}

