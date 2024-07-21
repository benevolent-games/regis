
import {ev} from "@benev/slate"
import {scalar} from "@benev/toolbox"

import {Venue} from "./venue.js"
import {Orbitcam} from "../../orbitcam.js"

const {degrees} = scalar.radians.from

export type Stage = ReturnType<typeof makeStage>

// persistent fixtures of the 3d scene
export function makeStage(venue: Venue) {
	const {scene, canvas, rendering, gameloop} = venue.world

	const orbitcam = new Orbitcam({
		scene,
		smoothing: 7,
		zoomRange: [3, 50],
		straightenAtTop: false,
		zoomAddsPivotHeight: 1.5,
		zoomSensitivity: 3 / 100,
		orbitSensitivity: 5 / 1000,
		verticalRange: [degrees(0), degrees(90)],
	})

	orbitcam.gimbal = [degrees(90), degrees(45)]
	rendering.setCamera(orbitcam.camera)

	ev(canvas, {wheel: orbitcam.wheel})
	gameloop.on(orbitcam.tick)

	// cameraSelectacon.onSelected(selected => {
	// 	orbitcam.pivot = coordinator.toPosition(
	// 		selected
	// 			? selected.place
	// 			: [0, 0],
	// 	)
	// })

	return {
		orbitcam,
	}
}

