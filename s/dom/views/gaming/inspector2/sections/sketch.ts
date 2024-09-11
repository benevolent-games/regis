
import {html, is, RenderResult, wherefor} from "@benev/slate"

import {Bridge} from "../../../../utils/bridge.js"
import {renderDataItems, renderDataList} from "../utils/render-data-list.js"
import {capitalize} from "../../../../../tools/capitalize.js"
import {Archetype} from "../../../../../config/units/archetype.js"
import {BoardRange, Repeatability, Verticality} from "../../../../../config/units/traits.js"

export function unitSections(bridge: Bridge) {
	const agent = bridge.agent.value
	const selection = bridge.selectaconSelection.value

	if (selection?.kind !== "tile")
		return null

	const unit = agent.units.at(selection.place)
	if (!unit)
		return null

	const archetype = agent.archetype(unit.kind)

	return html`
		<section class="archetype">
			<h2>${capitalize(unit.kind)} Archetype</h2>
			<div class=aspects>
				${renderAspects(archetype)}
			</div>
		</section>
	`
}

function renderAspects(archetype: Archetype) {
	const aspects: [string, RenderResult][] = [
		["Mortal", wherefor(archetype.mortal, ({health}) =>
			renderDataItems({
				health,
			})
		)],

		["Armed", wherefor(archetype.armed, ({damage, range, repeatable, verticality}) =>
			renderDataItems({
				damage,
				range: renderRange(range),
				repeatable: wherefor(repeatable, renderRepeatable),
				verticality: wherefor(verticality, renderVerticality),
			})
		)],

		["Healer", wherefor(archetype.healer, ({range, healing, repeatable, verticality}) =>
			renderDataItems({
				healing,
				range: renderRange(range),
				repeatable: wherefor(repeatable, renderRepeatable),
				verticality: wherefor(verticality, renderVerticality),
			})
		)],

		["Mobile", wherefor(archetype.mobile, ({range, verticality}) =>
			renderDataItems({
				range: renderRange(range),
				verticality: wherefor(verticality, renderVerticality),
			})
		)],

		["Sighted", wherefor(archetype.sighted, ({range, verticality}) =>
			renderDataItems({
				range: renderRange(range),
				verticality: wherefor(verticality, renderVerticality),
			})
		)],

		["Multitasker", wherefor(archetype.multitasker, ({count}) =>
			renderDataItems({
				count,
			})
		)],
	]

	return aspects
		.filter(([,v]) => is.available(v))
		.map(([name, items]) => html`
			<ul class=aspect>
				<h3>${name}</h3>
				${items}
			</ul>
		`)
}

function renderRange(range: BoardRange) {
	return range.steps + (
		range.kind === "manhattan"
			? " (manhattan)"
			: ""
	)
}

function renderRepeatable({count, focusFire}: Repeatability) {
	return `${count}` + (focusFire ? " (with focus fire)" : "(no focus fire)")
}

function renderVerticality({above, below}: Verticality) {
	if (above || below) {
		return (
			(above && below) ? "above and below"
			: above ? "above"
			: "below"
		)
	}
	else {
		return "flat"
	}
}

