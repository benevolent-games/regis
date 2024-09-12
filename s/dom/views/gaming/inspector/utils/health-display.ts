
import {html} from "@benev/slate"
import {loop} from "@benev/toolbox"
import {Unit} from "../../../../../logic/state.js"
import {Archetype} from "../../../../../config/units/archetype.js"

export function healthDisplay(unit: Unit, arc: Archetype) {
	let text: string | null = null
	let pattern: string | null = null

	if (arc.mortal?.health) {
		const currentHealth = arc.mortal.health - unit.damage
		text = `${currentHealth}/${arc.mortal.health}`
		pattern = ""
		for (const i of loop(arc.mortal.health)) {
			pattern += (i < currentHealth)
				? "■"
				: "□"
		}

		return html`
			<span class=health>
				<span class="health-pattern">${pattern}</span>
				<span class="health-text">${text}</span>
			</span>
		`
	}

	return null
}

