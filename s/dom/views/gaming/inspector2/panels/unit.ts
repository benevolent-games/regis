
import {html, is, RenderResult, wherefor} from "@benev/slate"

import {Bridge} from "../../../../utils/bridge.js"
import {renderDataList} from "../utils/render-data-list.js"
import {capitalize} from "../../../../../tools/capitalize.js"
import {Archetype, Aspects} from "../../../../../config/units/archetype.js"
import {renderRange, renderRepeatable, renderVerticality} from "../utils/render-traits.js"

export function unitPanel(bridge: Bridge) {
	const agent = bridge.agent.value
	const selection = bridge.selectaconSelection.value

	if (selection?.kind !== "tile")
		return null

	const unit = agent.units.at(selection.place)
	if (!unit)
		return null

	const archetype = agent.archetype(unit.kind)

	const aspects = getAspectLists(archetype)
	delete aspects.explained
	const aspectLists = listify(aspects)

	return html`
		<section class=panel>
			<h1 class="unitkind" data-team="${team(unit.team)}">
				${capitalize(unit.kind)}
			</h1>

			${archetype.explained
				? html`<p>${archetype.explained.sentence}</p>`
				: null}

			<div class=group>
				${aspectLists.map(({aspectName, aspectList}) => html`
					<section>
						<h2>${capitalize(aspectName)}</h2>
						${aspectList}
					</section>
				`)}
			</div>
		</section>
	`
}

function team(teamId: number | null) {
	return (teamId === null)
		? "null"
		: teamId + 1
}

function listify(aspects: Record<keyof Aspects, RenderResult>) {
	return Object.entries(aspects)
		.filter(([,aspect]) => is.available(aspect))
		.map(([aspectName, aspectList]) => ({aspectName, aspectList}))
}

function getAspectLists(archetype: Archetype): Record<keyof Aspects, RenderResult> {
	return {
		explained: wherefor(archetype.explained, ({sentence}) =>
			renderDataList({
				sentence,
			})
		),

		mortal: wherefor(archetype.mortal, ({health}) =>
			renderDataList({
				health,
			})
		),

		armed: wherefor(archetype.armed, ({damage, range, repeatable, verticality}) =>
			renderDataList({
				damage,
				range: renderRange(range),
				repeatable: wherefor(repeatable, renderRepeatable),
				vertical: wherefor(verticality, renderVerticality),
			})
		),

		healer: wherefor(archetype.healer, ({range, healing, repeatable, verticality}) =>
			renderDataList({
				healing,
				range: renderRange(range),
				repeatable: wherefor(repeatable, renderRepeatable),
				verticality: wherefor(verticality, renderVerticality),
			})
		),

		mobile: wherefor(archetype.mobile, ({range, verticality}) =>
			renderDataList({
				range: renderRange(range),
				verticality: wherefor(verticality, renderVerticality),
			})
		),

		sighted: wherefor(archetype.sighted, ({range, verticality}) =>
			renderDataList({
				range: renderRange(range),
				verticality: wherefor(verticality, renderVerticality),
			})
		),

		multitasker: wherefor(archetype.multitasker, ({count}) =>
			renderDataList({
				count,
			})
		),

		recruiter: wherefor(archetype.recruiter, ({range, verticality}) =>
			renderDataList({
				range: renderRange(range),
				verticality: wherefor(verticality, renderVerticality),
			})
		),

		recruitable: wherefor(archetype.recruitable, ({cost, limit, unlockable}) =>
			renderDataList({
				cost,
				limit,
				"unlockable cost": wherefor(unlockable, u => u.price),
			})
		),

		stakeholder: wherefor(archetype.recruiter, ({range, verticality}) =>
			renderDataList({
				range: renderRange(range),
				verticality: wherefor(verticality, renderVerticality),
			})
		),
	}
}

