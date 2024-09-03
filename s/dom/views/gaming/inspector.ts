
import {Vec2} from "@benev/toolbox"
import {css, html} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {Bridge} from "../../utils/bridge.js"
import {Tile} from "../../../logic/state.js"
import {Agent} from "../../../logic/agent.js"
import {boardCoords} from "../../../tools/board-coords.js"
import { unitEssays } from "../../../logic/essays.js"

export const InspectorView = nexus.shadowView(use => (
		bridge: Bridge
	) => {

	use.name("inspector")
	use.styles(styles)

	const agent = bridge.agent.value
	const selection = bridge.selectaconSelection.value

	if (!selection)
		return null

	if (selection.kind === "tile") {
		const {place, tile} = selection
		return html`
			<div class="plate tile">
				${describeTile(agent, place, tile)}
			</div>
		`
	}
	else {
		return html`
			<div class="plate roster">
				<div>Roster ${selection.unitKind}</div>
			</div>
		`
	}
})

export function describeTile(agent: Agent, place: Vec2, tile: Tile) {
	const unit = agent.units.at(place)
	const coords = boardCoords(place)

	let headline = `Tile ${coords}`
	const sections: any[] = []

	// unit section
	if (unit) {
		const archetype = agent.archetype(unit.kind)
		const name = unit.kind.at(0)!.toUpperCase() + unit.kind.slice(1)
		headline = `${name} ${coords}`

		const health = (() => {
			if (archetype.health) {
				const currentHealth = archetype.health - unit.damage
				return `${currentHealth} / ${archetype.health}`
			}
			return "Invincible"
		})()

		sections.push(html`
			<section>
				${unitEssays[unit.kind]}
				<ul>
					<li><strong>health</strong> <span>${health}</span></li>
					${archetype.cost
						? html`<li><strong>cost</strong> <span>${archetype.cost}</span></li>`
						: null}
					${archetype.attack
						? html`<li><strong>damage</strong> <span>${archetype.attack.damage}</span></li>`
						: null}
				</ul>
			</section>
		`)
	}

	// tile section
	{
		const elevation = tile.elevation.toString() + (tile.step ? ".5" : "")
		sections.push(html`
			<section>
				<ul>
					<li><strong>elevation</strong> <span>${elevation}</span></li>
				</ul>
				${tile.elevation === 0
					? html`<p>This tile cannot be walked on.</p>`
					: null}
			</section>
		`)
	}

	return html`
		<h1>${headline}</h1>
		${sections}
	`
}

export const styles = css`
	:host {
		display: block;
	}

	ul, ol { list-style: none; }

	.plate {
		font-size: 0.8em;
		padding: 1em;
		background: #2224;
		backdrop-filter: blur(10px);
	}

	h1 {
		font-size: 1.4em;
	}
`

