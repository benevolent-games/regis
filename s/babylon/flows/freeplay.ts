
import {makeAgent} from "../agent/agent.js"
import * as mapPool from "../../map-pool.js"
import {defaultRoster} from "../../logic/state/teams.js"
import {makeVisualizer} from "../visualizer/visualizer.js"
import {extractAgentState} from "../../logic/arbitration/extract-agent-state.js"
import {initializeGameState} from "../../logic/arbitration/initialize-game-state.js"

export async function freeplayFlow() {
	let state = initializeGameState({
		ascii: mapPool.bridge,
		teams: [
			{
				name: "Blue",
				resources: 9, // first-turn income will be added
				roster: defaultRoster(),
			},
			{
				name: "Orange",
				resources: 12, // first-turn income will be added
				roster: defaultRoster(),
			},
		],
	})

	// function actuate(incident: Incident.Any) {
	// 	state = commit(state, incident)
	// }

	const getState = () => extractAgentState(state, state.arbiter)

	const visualizer = await makeVisualizer()

	const agent = makeAgent({
		getState,
		visualizer,
		playAsTeams: [0, 1],
	})

	function update() {
		const agentState = getState()
		visualizer.update(agentState)
	}

	update()

	return {
		world: visualizer.world,
		dispose() {
			agent.dispose()
			visualizer.dispose()
		},
	}

	// const venue = await makeVenue({
	// 	urls: {
	// 		chessGlb: "/assets/chess-08.glb",
	// 		envmap: "/assets/studiolights.env",
	// 	},
	// })
	//
	// const stage = makeStage(venue)
	//
	// const ephemeral = makeEphemeral()
	//
	// function rerender() {
	// 	const agentState = extractAgentState(state, state.arbiter)
	// 	render(venue, ephemeral, agentState)
	// }






	// const arbiter = new Arbiter(venue)
	// const agent = new Agent(() => venue.generateAgentState(null))
	// const {board, units, coordinator, boundaries} = agent

	// const renderStage = await createRenderStage({
	// 	urls: {
	// 		chessGlb: "/assets/chess-08.glb",
	// 		envmap: "/assets/studiolights.env",
	// 	},
	// })
	//
	// // const renderer = d(new Renderer(agent, chessGlb))
	// //
	// const mainSelectacon = new Selectacon(board, units)
	// const cameraSelectacon = new Selectacon(board, units)
	//
	// const orbitcam = d(new Orbitcam({
	// 	scene,
	// 	smoothing: 7,
	// 	zoomRange: [3, 50],
	// 	straightenAtTop: false,
	// 	zoomAddsPivotHeight: 1.5,
	// 	zoomSensitivity: 3 / 100,
	// 	orbitSensitivity: 5 / 1000,
	// 	verticalRange: [degrees(0), degrees(90)],
	// }))
	//
	// orbitcam.gimbal = [degrees(90), degrees(45)]
	// world.rendering.setCamera(orbitcam.camera)
	//
	// dr(ev(world.canvas, {wheel: orbitcam.wheel}))
	// dr(world.gameloop.on(orbitcam.tick))
	//
	// dr(cameraSelectacon.onSelected(selected => {
	// 	orbitcam.pivot = coordinator.toPosition(
	// 		selected
	// 			? selected.place
	// 			: [0, 0],
	// 	)
	// }))
	//
	// cameraSelectacon.select([3, 3])
	//
	// function grab(event: PointerEvent) {
	// 	const {pickedMesh} = scene.pick(
	// 		event.clientX,
	// 		event.clientY,
	// 		mesh => renderer.tiles.blockPlacements.has(mesh),
	// 	)
	// 	if (pickedMesh)
	// 		return renderer.tiles.blockPlacements.get(pickedMesh)!
	// }
	//
	// const rightMouseDrags = new DragQueen({
	// 	predicate: event => event.button === 2,
	// 	onAnyDrag: () => {},
	// 	onAnyClick: () => {},
	// 	onIntendedDrag: orbitcam.drag,
	// 	onIntendedClick: event => {
	// 		const place = grab(event)
	// 		if (place)
	// 			cameraSelectacon.select(place)
	// 	},
	// })
	//
	// const middleMouseDrags = new DragQueen({
	// 	predicate: event => event.button === 1,
	// 	onAnyClick: () => {},
	// 	onIntendedDrag: () => {},
	// 	onIntendedClick: () => {},
	// 	onAnyDrag: ({movementX, movementY}) => {
	// 		const panningSensitivity = 2 / 100
	// 		const movement = [movementX, movementY] as Vec2
	// 		orbitcam.pivot = (
	// 			Pipe.with(movement)
	// 				.to(v => vec2.rotate(
	// 					v,
	// 					orbitcam.camera.alpha + scalar.radians.from.degrees(90)
	// 				))
	// 				.to(v => vec2.multiplyBy(v, panningSensitivity))
	// 				.to(([x, z]) => [x, 0, z] as Vec3)
	// 				.to(v => vec3.add(orbitcam.pivot, v))
	// 				.to(v => boundaries.clampPosition(v))
	// 				.done()
	// 		)
	// 	},
	// })
	//
	// dr(ev(world.canvas, rightMouseDrags.events))
	// dr(ev(world.canvas, middleMouseDrags.events))
	// dr(ev(document, {contextmenu: (e: Event) => e.preventDefault()}))
	//
	// // const sun = d(new DirectionalLight(
	// // 	"sun",
	// // 	new Vector3(.123, -1, .234).normalize(),
	// // 	scene,
	// // ))
	// //
	// // sun.intensity = .2
	//
	// world.gameloop.start()
	//
	// ///////////////////////////////
	//
	// function performAction(action: Incident.Action.Any) {
	// 	arbiter.commit(action)
	// 	renderer.render()
	// }
	//
	// return {world, dispose: trash.dispose}
}

