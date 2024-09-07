
import {Turn} from "../../logic/state.js"
import {Agent} from "../../logic/agent.js"
import {Assets} from "../assets/assets.js"
import {Selectacon} from "../parts/selectacon.js"
import {SpawnGhostRenderer} from "./parts/spawn-ghost-renderer.js"
import {TurnTracker} from "../../logic/simulation/aspects/turn-tracker.js"

export type PlannerOptions = {
	agent: Agent
	assets: Assets
	selectacon: Selectacon
	turnTracker: TurnTracker
	spawnGhosts: SpawnGhostRenderer
	submitTurn: (turn: Turn) => void
}

export type Indicate = undefined | "pattern" | "action"

