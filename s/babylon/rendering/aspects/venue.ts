
import {make_envmap} from "@benev/toolbox"

import {World} from "../../world.js"
import {ChessGlb} from "../../chess-glb.js"
import {Trashbin} from "../../../tools/trashbin.js"

export type Venue = Awaited<ReturnType<typeof makeVenue>>

export async function makeVenue(options: {
		urls: {
			chessGlb: string
			envmap: string
		}
	}) {

	const trashbin = new Trashbin()
	const {disposable: d} = trashbin

	const world = d(await World.load())
	const container = d(await world.loadContainer(options.urls.chessGlb))
	const {scene} = world

	const chessGlb = new ChessGlb(container)
	chessGlb.props.forEach((_, name) => console.log("prop:", name))

	d(make_envmap(scene, options.urls.envmap))
	scene.environmentIntensity = 0.1

	return {
		trashbin,
		world,
		chessGlb,
	}
}

