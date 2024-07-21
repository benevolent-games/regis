
import {scalar} from "@benev/toolbox"
import {World} from "../../world.js"
import {Orbitcam} from "../../orbitcam.js"

const {degrees} = scalar.radians.from

export function makeCameraRigging(
		{scene, rendering, gameloop}: World,
	) {

	const orbitcam = new Orbitcam({
		scene,
		smoothing: 7,
		zoomRange: [3, 50],
		straightenAtTop: false,
		zoomAddsPivotHeight: 2,
		zoomSensitivity: 3 / 100,
		orbitSensitivity: 5 / 1000,
		verticalRange: [degrees(0), degrees(90)],
	})

	orbitcam.gimbal = [degrees(90), degrees(45)]
	rendering.setCamera(orbitcam.camera)

	const cancelLoop = gameloop.on(orbitcam.tick)

	return {
		orbitcam,
		dispose() {
			if (rendering.camera === orbitcam.camera)
				rendering.setCamera(null)
			cancelLoop()
			orbitcam.dispose()
		},
	}
}

