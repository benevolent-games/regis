
import {html, is, RenderResult, wherefor} from "@benev/slate"
import {renderDataList} from "./render-data-list.js"
import {capitalize} from "../../../../../tools/capitalize.js"
import {Archetype, Aspects} from "../../../../../config/units/archetype.js"
import {renderRange, renderRepeatable, renderVerticality} from "./render-traits.js"

export function archetypeDisplay(archetype: Archetype) {
	const aspects = getAspectLists(archetype)
	delete aspects.explained
	const aspectLists = listify(aspects)

	return {
		sentence: wherefor(archetype.explained, e => html`
			<p>${e.sentence}</p>
		`),
		sections: html`
			${aspectLists.map(({aspectName, aspectList}) => html`
				<section>
					<h2>${capitalize(aspectName)}</h2>
					${aspectList}
				</section>
			`)}
		`,
	}
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
				verticality: wherefor(verticality, renderVerticality),
				repeatable: wherefor(repeatable, renderRepeatable),
			})
		),

		healer: wherefor(archetype.healer, ({range, healing, repeatable, verticality}) =>
			renderDataList({
				healing,
				range: renderRange(range),
				verticality: wherefor(verticality, renderVerticality),
				repeatable: wherefor(repeatable, renderRepeatable),
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

