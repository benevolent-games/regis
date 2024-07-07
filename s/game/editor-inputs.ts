
import boxSvg from "../dom/icons/tabler/box.svg.js"
import {Action, Actions, modes} from "../tools/inputs/types.js"

export const editorActionsList: Action[] = []

function register<A extends Actions>(a: A) {
	for (const action of Object.values(a))
		editorActionsList.push(action)
	return a
}

export const editorActions = modes({
	common: register({
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
	}),

	terrain: register({
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
	}),

	advanced: register({
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
	}),
})

export const editorModes = modes({
	terrain: {
		...editorActions.common,
		...editorActions.terrain,
	},
	advanced: {
		...editorActions.common,
		...editorActions.advanced,
	},
})

