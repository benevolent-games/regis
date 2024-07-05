
import {Signal, ev} from "@benev/slate"

export type InputMethod = "none" | "touch" | "keys"

export function detectInputMethod(target: EventTarget, inputMethod: Signal<InputMethod>) {
	return () => {

		function set(m: InputMethod) {
			if (inputMethod.value !== m)
				inputMethod.value = m
		}

		return ev(target, {
			keydown: () => set("keys"),
			pointerdown: (event: PointerEvent) => {
				if (event.pointerType === "touch") set("touch")
				else set("keys")
			},
		})
	}
}

