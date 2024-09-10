
import {html} from "@benev/slate"
import {Bridge} from "../../../../utils/bridge.js"
import {capitalize} from "../../../../../tools/capitalize.js"
import {boardCoords} from "../../../../../tools/board-coords.js"

export function inspectorHeadline(bridge: Bridge) {
	const agent = bridge.agent.value
	const teamId = bridge.teamId.value
	const selection = bridge.selectaconSelection.value

	if (selection?.kind === "tile") {
		const unit = agent.units.at(selection.place)

		if (unit) {
			const isFriendly = unit.team === teamId
			const teamNumber = unit.team === null
				? null
				: (unit.team + 1)
			return html`
				<h1 data-team-number="${teamNumber}" ?data-is-friendly="${isFriendly}">
					<span class=coords>
						${boardCoords(selection.place)}
					</span>
					<span class=unitkind>
						${capitalize(unit.kind)}
					</span>
				</h1>
			`
		}
		else {
			return html`
				<h1>
					<span class=coords>${boardCoords(selection.place)}</span>
					<span class=tile>Tile</span>
				</h1>
			`
		}
	}

	else if (selection?.kind === "roster") {
		const teamNumber = selection.teamId === null
			? null
			: (selection.teamId + 1)
		return html`
			<h1 data-team-number="${teamNumber}">
				<span class=roster>Roster</span>
				<span class=unitkind>${capitalize(selection.unitKind)}</span>
			</h1>
		`
	}

	else {
		return null
	}
}

