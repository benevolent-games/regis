
import {html} from "@benev/slate"
import {Bridge} from "../../../../utils/bridge.js"
import {renderDataList} from "../utils/render-data-list.js"
import {boardCoords} from "../../../../../tools/board-coords.js"

export function tilePanel(bridge: Bridge) {
	const agent = bridge.agent.value
	const selection = bridge.selectaconSelection.value

	if (selection?.kind !== "tile")
		return null

	const tile = agent.tiles.at(selection.place)

	return html`
		<section class=panel>
			<h1>${boardCoords(selection.place)}</h1>

			<div class=group>
				<section>
					${renderDataList({
						elevation: agent.coordinator.elevationWithStep(tile),
						step: tile.step
							? `connects tiles above and below`
							: null
					})}
				</section>
			</div>
		</section>
	`
}

