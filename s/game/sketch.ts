
import {SVGTemplateResult} from "@benev/slate"
import boxSvg from "../dom/icons/tabler/box.svg"

type Action = {
	label: string
	buttons: string[]
	icon: null | SVGTemplateResult
}

type Actions = Record<string, Action>
type Modes = Record<string, Actions>

function modes<M extends Modes>(m: M) {
	return m
}

type Input = {
	down: boolean
}

type Listener = ({}: Input) => void

export class InputSystems {
	listeners = new Map<Action, Set<Listener>>()

	on(action: Action, listener: Listener) {
		let set = this.listeners.get(action)
		if (!set) {
			set = new Set<Listener>()
			this.listeners.set(action, set)
		}
		set.add(listener)
		return () => set.delete(listener)
	}
}

export class EditorActions {
	set = new Set<Action>()

	register<A extends Actions>(actions: A) {
		for (const action of Object.values(actions))
			this.set.add(action)
		return actions
	}

	common = this.register({
		select: {
			label: "Select",
			buttons: ["Touch1"],
			icon: boxSvg,
		},

		switch: {
			label: "Switch",
			buttons: ["Tab"],
			icon: boxSvg,
		},

		zoom: {
			label: "Zoom",
			buttons: ["Space", "Touch6"],
			icon: boxSvg,
		},

		panUp: {
			label: "Pan Up",
			buttons: ["KeyW"],
			icon: boxSvg,
		},

		panDown: {
			label: "Pan Down",
			buttons: ["KeyS"],
			icon: boxSvg,
		},

		panLeft: {
			label: "Pan Left",
			buttons: ["KeyA"],
			icon: boxSvg,
		},

		panRight: {
			label: "Pan Right",
			buttons: ["KeyD"],
			icon: boxSvg,
		},
	})

	terrain = this.register({
		raise: {
			label: "Raise",
			buttons: ["KeyE"],
			icon: boxSvg,
		},

		lower: {
			label: "Lower",
			buttons: ["KeyQ"],
			icon: boxSvg,
		},

		level: {
			label: "Level",
			buttons: ["KeyR"],
			icon: boxSvg,
		},
	})

	advanced = this.register({
		corner: {
			label: "Corner",
			buttons: ["KeyE"],
			icon: boxSvg,
		},

		ramp: {
			label: "Ramp",
			buttons: ["KeyQ"],
			icon: boxSvg,
		},
	})

	modes = modes({
		terrain: {
			...this.common,
			...this.terrain,
		},
		advanced: {
			...this.common,
			...this.advanced,
		},
	})
}

