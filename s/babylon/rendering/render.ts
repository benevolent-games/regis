
import {Venue} from "./aspects/venue.js"
import {Ephemeral} from "./aspects/ephemeral.js"
import {makeTileRenderer} from "./tile-renderer.js"
import {AgentState} from "../../logic/state/game.js"
import {boardery} from "../../logic/helpers/boardery.js"

export function render(venue: Venue, ephemeral: Ephemeral, state: AgentState) {
	ephemeral.wipe()

	const tiles = makeTileRenderer(
		state.board,
		venue,
		ephemeral,
	)

	for (const {tile, place} of boardery(state.board).list())
		tiles.renderTile(tile, place)
}

