
import {html, wherefor} from "@benev/slate"
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
			const archetype = agent.archetype(unit.kind)
			return html`
				<h1
					data-team-number="${teamNumber(unit.team)}"
					?data-is-friendly="${unit.team === teamId}">

					<span class=coords>
						${boardCoords(selection.place)}
					</span>
					<span class=unitkind>
						${capitalize(unit.kind)}
					</span>
				</h1>
				${wherefor(archetype.explained, e => html`
					<p>${e.sentence}</p>
				`)}
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
		return html`
			<h1 data-team-number="${teamNumber(selection.teamId)}">
				<span class=roster>Roster</span>
				<span class=unitkind>${capitalize(selection.unitKind)}</span>
			</h1>
		`
	}

	else {
		return null
	}
}

////////////////////////////////////////////

function teamNumber(teamId: number | null) {
	return (teamId === null)
		? null
		: (teamId + 1)
}

