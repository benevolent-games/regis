
import {make_envmap, Prop, Vec2} from "@benev/toolbox"

import {World} from "../world.js"
import {ChessGlb} from "../chess-glb.js"
import {Trashbin} from "../../tools/trashbin.js"

export type RenderStage = Awaited<ReturnType<typeof createRenderStage>>

// - render venue (world, container, glb, env)
// - render stage (block placements, )
// - render ephermeral

export async function createRenderStage(options: {
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

	d(chessGlb.border())

	d(make_envmap(scene, options.urls.envmap))
	scene.environmentIntensity = 0.1

	const blockPlacements = new Map<Prop, Vec2>()

	return {
		world,
		trashbin,
		chessGlb,
		container,
		blockPlacements,
	}
}

