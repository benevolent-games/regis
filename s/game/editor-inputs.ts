
import {Tact} from "@benev/toolbox"
import {signal} from "@benev/slate"
import {bindings_helpers} from "@benev/toolbox/x/tact/parts/bindings_helpers.js"

type EditorMode = (
	| "terrain"
	| "advanced"
)

export class EditorInputs {
	#mode = signal<EditorMode>("terrain")

	devices = {
		keyboard: new Tact.devices.Keyboard(window),
		mouseButtons: new Tact.devices.MouseButtons(window),
		touchButtons: new Tact.devices.Virtual<
			| "Touch1"
			| "Touch2"
			| "Touch3"
			| "Touch4"
			| "Touch5"
			| "Touch6"
			| "Touch7"
			| "Touch9"
			| "Touch10"
			| "Touch11"
			| "Touch12"
		>(),
	}

	// TODO associate buttons with labels and icons
	actions = (() => {

	})()

	tact = (() => {
		const {mode, buttonGroup, buttons, b} = bindings_helpers

		const common = buttonGroup({
			panUp: buttons(b("KeyW")),
			panDown: buttons(b("KeyS")),
			panLeft: buttons(b("KeyA")),
			panRight: buttons(b("KeyD")),
			zoom: buttons(b("Space"), b("Touch6")),
			select: buttons(b("Touch1")),
		})

		const tabulation = buttonGroup({
			terrainMode: buttons(b("KeyZ"), b("Touch7")),
			advancedMode: buttons(b("KeyX"), b("Touch8")),
			mainMenu: buttons(b("KeyB"), b("Touch12"))
		})

		const tact = new Tact(window, {
			common: mode({vectors: {}, buttons: common}),
			tabulation: mode({vectors: {}, buttons: tabulation}),
			terrain: mode({
				vectors: {},
				buttons: {
					raise: buttons(b("KeyE"), b("Touch2")),
					lower: buttons(b("KeyQ"), b("Touch3")),
					level: buttons(b("KeyQ"), b("Touch4")),
				},
			}),
			advanced: mode({
				vectors: {},
				buttons: {
					corner: buttons(b("KeyE"), b("Touch2")),
					ramp: buttons(b("KeyQ"), b("Touch3")),
				},
			}),
		} satisfies Record<EditorMode, any> & Record<string, any>)

		tact.devices.add(
			this.devices.keyboard,
			this.devices.mouseButtons,
			this.devices.touchButtons,
		)

		const setMode = (mode: EditorMode) => () => {
			tact.modes.assign("common", "tabulation", mode)
			this.#mode.value = mode
		}

		tact.inputs.tabulation.buttons.terrainMode
			.onPressed(setMode("terrain"))

		tact.inputs.tabulation.buttons.advancedMode
			.onPressed(setMode("advanced"))
	})()
}

