
import {html} from "@benev/slate"
import {Bridge} from "../../../../utils/bridge.js"
import {renderDataList} from "../utils/render-data-list.js"

export function tileSection(bridge: Bridge) {
	const agent = bridge.agent.value
	const selection = bridge.selectaconSelection.value

	if (selection?.kind !== "tile")
		return null

	const tile = agent.tiles.at(selection.place)

	return html`
		<section>
			<h2>Tile</h2>
			${renderDataList({
				elevation: agent.coordinator.elevationWithStep(tile),
				claims: tile.claims.length,
			})}
		</section>
	`
}

