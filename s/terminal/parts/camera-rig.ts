
import {scalar} from "@benev/toolbox"

import {World} from "./world.js"
import {Orbitcam} from "./orbitcam.js"
import {Trashbin} from "../../tools/trashbin.js"

const {degrees} = scalar.radians.from

export class CameraRig {
	orbitcam: Orbitcam
	#trashbin = new Trashbin()

	constructor({world}: {world: World}) {
		const orbitcam = this.orbitcam = this.#trashbin.disposable(new Orbitcam({
			scene: world.scene,
			smoothing: 7,
			zoomRange: [3, 50],
			straightenAtTop: false,
			zoomAddsPivotHeight: 2,
			zoomSensitivity: 3 / 100,
			orbitSensitivity: 5 / 1000,
			verticalRange: [degrees(0), degrees(90)],
		}))

		orbitcam.gimbal = [degrees(90), degrees(45)]
		world.rendering.setCamera(orbitcam.camera)
		this.#trashbin.disposer(world.gameloop.on(orbitcam.tick))
	}

	dispose = this.#trashbin.dispose
}

