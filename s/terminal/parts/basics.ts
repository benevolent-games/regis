
import {make_envmap} from "@benev/toolbox"

import {World} from "./world.js"
import {Assets} from "./assets.js"
import {constants} from "../../constants.js"

export async function makeBasicVisuals() {
	const world = await World.load()
	const assets = await Assets.load(world, constants.urls.assets)

	const envmap = make_envmap(world.scene, constants.urls.envmap)
	world.scene.environmentIntensity = 0.1

	return {
		world,
		assets,
		dispose() {
			envmap.dispose()
			assets.dispose()
			world.dispose()
		},
	}
}

