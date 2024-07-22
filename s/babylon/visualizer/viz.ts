
import {Party} from "./parts/party.js"
import {World} from "./parts/world.js"
import {Agent} from "../../logic/agent.js"
import {ChessGlb} from "./parts/chess-glb.js"

export type Viz = {
	agent: Agent
	party: Party
	world: World
	chessGlb: ChessGlb
}

