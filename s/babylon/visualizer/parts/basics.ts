
import {make_envmap} from "@benev/toolbox"

import {World} from "./world.js"
import {ChessGlb} from "./chess-glb.js"
import {constants} from "../../constants.js"

export async function makeVisualizerBasics() {
	const world = await World.load()
	const container = await world.loadContainer(constants.urls.chessGlb)
	const {scene} = world

	const chessGlb = new ChessGlb(container)
	chessGlb.props.forEach((_, name) => console.log("prop:", name))

	const envmap = make_envmap(scene, constants.urls.envmap)
	scene.environmentIntensity = 0.1

	return {
		world,
		chessGlb,
		dispose() {
			envmap.dispose()
			container.dispose()
			world.dispose()
		},
	}
}

