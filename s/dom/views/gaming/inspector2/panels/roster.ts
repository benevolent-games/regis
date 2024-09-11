
import {html} from "@benev/slate"
import {Bridge} from "../../../../utils/bridge.js"
import {renderPricetag} from "../utils/render-pricetag.js"
import {capitalize} from "../../../../../tools/capitalize.js"
import {archetypeDisplay} from "../utils/archetype-display.js"

export function rosterPanel(bridge: Bridge) {
	const agent = bridge.agent.value
	const teamId = bridge.teamId.value
	const selection = bridge.selectaconSelection.value

	if (selection?.kind !== "roster")
		return null

	const {unitKind} = selection
	const archetype = agent.archetype(unitKind)
	const arcdisplay = archetypeDisplay(archetype)
	const recruitable = archetype.recruitable!

	return html`
		<section class=panel>
			<h1>
				<span>Recruitable</span>
				<span>${capitalize(unitKind)}</span>
				${renderPricetag(agent, teamId, recruitable.cost)}
			</h1>

			${arcdisplay.sentence}

			<div class=group>
				${arcdisplay.sections}
			</div>
		</section>
	`
}

