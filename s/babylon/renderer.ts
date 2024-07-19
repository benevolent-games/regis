
import {ChessGlb} from "./chess-glb.js"
import {Agent} from "../machinery/game/agent.js"
import {makeTileRenderer, TileRenderer} from "./rendering/tile-renderer.js"

export class Renderer {
	tiles: TileRenderer

	constructor(
			public agent: Agent,
			public chessGlb: ChessGlb,
		) {
		this.tiles = makeTileRenderer(chessGlb, this.agent.coordinator)
	}

	render() {
		this.tiles.dispose()
		for (const {tile, place} of this.agent.board.loop())
			this.tiles.renderTile(tile, place)
	}

	dispose() {
		this.tiles.dispose()
	}
}

