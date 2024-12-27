
import {Trashbin} from "@benev/slate"

import {World} from "./world.js"
import {Degrees, Vec2} from "@benev/toolbox"
import {Orbitcam} from "./orbitcam.js"

export class CameraRig {
	orbitcam: Orbitcam
	#trashbin = new Trashbin()

	constructor({world, teamId}: {world: World, teamId: number}) {
		const orbitcam = this.orbitcam = this.#trashbin.disposable(new Orbitcam({
			scene: world.scene,
			smoothing: 7,
			zoomRange: new Vec2(3, 50),
			straightenAtTop: false,
			zoomAddsPivotHeight: 2,
			zoomSensitivity: 3 / 100,
			orbitSensitivity: 5 / 1000,
			verticalRange: new Vec2(Degrees.toRadians(1), Degrees.toRadians(89)),
		}))

		const x = teamId === 0
			? Degrees.toRadians(90)
			: Degrees.toRadians(270)

		orbitcam.gimbal = new Vec2(x, Degrees.toRadians(30))

		world.rendering.setCamera(orbitcam.camera)
		this.#trashbin.disposer(world.gameloop.on(orbitcam.tick))
	}

	dispose = this.#trashbin.dispose
}

