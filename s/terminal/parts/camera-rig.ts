
import {scalar} from "@benev/toolbox"
import {Trashbin} from "@benev/slate"

import {World} from "./world.js"
import {Orbitcam} from "./orbitcam.js"

const {degrees} = scalar.radians.from

export class CameraRig {
	orbitcam: Orbitcam
	#trashbin = new Trashbin()

	constructor({world, teamId}: {world: World, teamId: number}) {
		const orbitcam = this.orbitcam = this.#trashbin.disposable(new Orbitcam({
			scene: world.scene,
			smoothing: 7,
			zoomRange: [3, 50],
			straightenAtTop: false,
			zoomAddsPivotHeight: 2,
			zoomSensitivity: 3 / 100,
			orbitSensitivity: 5 / 1000,
			verticalRange: [degrees(1), degrees(89)],
		}))

		const x = teamId === 0
			? degrees(90)
			: degrees(270)

		orbitcam.gimbal = [x, degrees(30)]

		world.rendering.setCamera(orbitcam.camera)
		this.#trashbin.disposer(world.gameloop.on(orbitcam.tick))
	}

	dispose = this.#trashbin.dispose
}

