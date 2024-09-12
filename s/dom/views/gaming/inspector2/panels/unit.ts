
import {html} from "@benev/slate"
import {Bridge} from "../../../../utils/bridge.js"
import {capitalize} from "../../../../../tools/capitalize.js"
import {archetypeDisplay} from "../utils/archetype-display.js"
import { healthDisplay } from "../utils/health-display.js"

export function unitPanel(bridge: Bridge) {
	const agent = bridge.agent.value
	const teamId = bridge.teamId.value
	const selection = bridge.selectaconSelection.value

	if (selection?.kind !== "tile")
		return null

	const unit = agent.units.at(selection.place)
	if (!unit)
		return null

	const archetype = agent.archetype(unit.kind)
	const arcdisplay = archetypeDisplay(archetype)

	const team = (unit.team === null)
		? "null"
		: unit.team + 1

	const allegiance = (
		unit.team === null ? "neutral"
		: unit.team === teamId ? "friendly"
		: "enemy"
	)

	const allegianceValence = (
		allegiance === "friendly" ? "happy"
		: allegiance === "enemy" ? "meh"
		: "meh"
	)

	return html`
		<section class=panel>
			<h1 data-team="${team}">
				<span
					class="allegiance ${allegianceValence}"
					data-allegiance="${allegiance}">
					${capitalize(allegiance)}
				</span>
				<span class="unitkind">
					${capitalize(unit.kind)}
				</span>
				${healthDisplay(unit, archetype)}
			</h1>

			${arcdisplay.sentence}

			<div class=group>
				${arcdisplay.sections}
			</div>
		</section>
	`
}

