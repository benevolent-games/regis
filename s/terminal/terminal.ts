
import {Trashbin} from "@benev/slate"

import {Turn} from "../logic/state.js"
import {Tiler} from "./parts/tiler.js"
import {Agent} from "../logic/agent.js"
import {Rosters} from "./parts/rosters.js"
import {Hovering} from "./parts/hovering.js"
import {Planner} from "./planner/planner.js"
import {Claimery} from "./parts/claimery.js"
import {CameraRig} from "./parts/camera-rig.js"
import {Selectacon} from "./parts/selectacon.js"
import {UserInputs} from "./parts/user-inputs.js"
import {GamePhase} from "../net/game-session.js"
import {makeBasicVisuals} from "./parts/basics.js"
import {UnitVisuals} from "./parts/unit-visuals.js"
import {FogFenceRenderer} from "./parts/fog-of-war.js"
import {setupPreviewAgent} from "./parts/preview-agent.js"
import {TerminalActions} from "./parts/terminal-actions.js"
import {TurnTracker} from "../logic/simulation/aspects/turn-tracker.js"
import {SpawnGhostRenderer} from "./planner/parts/spawn-ghost-renderer.js"

export type Terminal = Awaited<ReturnType<typeof makeGameTerminal>>

export async function makeGameTerminal(

		// actual state from the arbiter
		baseAgent: Agent,

		// tracking which team we can play as
		turnTracker: TurnTracker,

		// submit the player's turn to the arbiter
		submitTurn: (turn: Turn) => void,

		getGamePhase: () => GamePhase,
	) {

	const trashbin = new Trashbin()
	const d = trashbin.disposable
	const dr = trashbin.disposer
	const {dispose} = trashbin

	const {agent, reset: resetPreview} = d(
		setupPreviewAgent(baseAgent, () => planner.reset())
	)

	const {world, assets} = d(await makeBasicVisuals())
	// d(assets.board.border())

	const cameraRig = d(new CameraRig({world, teamId: turnTracker.teamId}))
	const tiler = d(new Tiler({agent, world, assets}))
	const rosters = d(new Rosters({agent, world, assets, turnTracker}))
	const selectacon = d(new Selectacon({agent, world, assets, tiler, rosters, turnTracker}))
	const unitVisuals = d(new UnitVisuals(agent, assets))
	const claimery = d(new Claimery({agent, world, assets}))
	const fogFence = d(new FogFenceRenderer({agent: baseAgent, assets, turnTracker}))

	const spawnGhosts = new SpawnGhostRenderer({assets, selectacon})
	const planner = d(new Planner({agent, assets, selectacon, turnTracker, spawnGhosts, submitTurn, getGamePhase: getGamePhase}))
	d(new Hovering({world, selectacon}))

	const actions: TerminalActions = {
		resetPreview,
		commitTurn: () => planner.executePlan(),
		selectRosterUnit: (teamId, unitKind) => {
			const placement = [...rosters.placements.values()]
				.find(placement => (
					placement.teamId === teamId &&
					placement.unitKind === unitKind
				))
			if (placement) {
				selectacon.selection.value = {
					kind: "roster",
					teamId,
					unitKind,
					position: placement.position,
				}
			}
		},
	}

	d(new UserInputs({agent, world, planner, selectacon, cameraRig, turnTracker, actions}))

	dr(selectacon.selection.on(() => planner.render()))

	dr(selectacon.hover.on(() => spawnGhosts.render()))
	dr(selectacon.selection.on(() => spawnGhosts.render()))

	function render() {
		rosters.render()
		selectacon.render()
		unitVisuals.render()
		planner.render()
		claimery.render()
		fogFence.render()
		spawnGhosts.render()
	}

	tiler.render()
	render()
	world.gameloop.start()
	dr(agent.onStateChange(render))

	return {
		world,
		actions,
		planner,
		selectacon,
		previewAgent: agent,
		render,
		dispose,
	}
}

