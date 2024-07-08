
import boxSvg from "../dom/icons/tabler/box.svg.js"
import {actionModes} from "../tools/inputs/types.js"
import {InputCenter} from "../tools/inputs/input-center.js"

export function makeEditorInputs() {
	const catalog = actionModes({
		common: {
			select: {
				label: "Select",
				codes: ["Touch1"],
				icon: boxSvg,
			},

			switch: {
				label: "Switch",
				codes: ["Tab"],
				icon: boxSvg,
			},

			zoom: {
				label: "Zoom",
				codes: ["Space", "Touch6"],
				icon: boxSvg,
			},

			panUp: {
				label: "Pan Up",
				codes: ["KeyW"],
				icon: boxSvg,
			},

			panDown: {
				label: "Pan Down",
				codes: ["KeyS"],
				icon: boxSvg,
			},

			panLeft: {
				label: "Pan Left",
				codes: ["KeyA"],
				icon: boxSvg,
			},

			panRight: {
				label: "Pan Right",
				codes: ["KeyD"],
				icon: boxSvg,
			},
		},

		terrain: {
			raise: {
				label: "Raise",
				codes: ["KeyE"],
				icon: boxSvg,
			},

			lower: {
				label: "Lower",
				codes: ["KeyQ"],
				icon: boxSvg,
			},

			level: {
				label: "Level",
				codes: ["KeyR"],
				icon: boxSvg,
			},
		},

		advanced: {
			corner: {
				label: "Corner",
				codes: ["KeyE"],
				icon: boxSvg,
			},

			ramp: {
				label: "Ramp",
				codes: ["KeyQ"],
				icon: boxSvg,
			},
		},
	})

	const modes = actionModes({
		terrain: {
			...catalog.common,
			...catalog.terrain,
		},
		advanced: {
			...catalog.common,
			...catalog.advanced,
		},
	})

	return new InputCenter(catalog, modes)
}

