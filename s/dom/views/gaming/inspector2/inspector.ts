
import {css, html} from "@benev/slate"

import {nexus} from "../../../nexus.js"
import {Bridge} from "../../../utils/bridge.js"
import {inspectorHeadline} from "./parts/headline.js"

import {tileSection} from "./sections/tile.js"
import {unitSections} from "./sections/sketch.js"

export const InspectorView = nexus.shadowView(use => (
		bridge: Bridge,
	) => {

	use.name("inspector")
	use.styles(styles)

	const selection = bridge.selectaconSelection.value

	if (selection === null)
		return null

	return html`
		<hgroup>
			${inspectorHeadline(bridge)}
		</hgroup>

		<div class=holder>
			${unitSections(bridge)}
			${tileSection(bridge)}
		</div>
	`
})

export const styles = css`

:host {
	display: flex;
	flex-direction: column;
	width: 100%;
	text-shadow: .1em .2em .2em black;
	gap: 1em;

	outline: 1px solid red;

	--team1: cyan;
	--team2: yellow;
}

hgroup {
	display: flex;
	flex-direction: column;

	h1 {
		display: flex;
		gap: 1rem;

		--teamColor: #888;
		&[data-team-number="1"] { --teamColor: var(--team1); }
		&[data-team-number="2"] { --teamColor: var(--team2); }

		:is(.coords, .roster) {
			opacity: 0.3;
		}

		.coords {
			font-family: monospace;
			min-width: 3rem;
			display: flex;
			justify-content: end;
			align-items: center;
		}

		.roster {}

		.unitkind {
			text-shadow: 0 0 .5em color-mix(
				in srgb,
				transparent,
				var(--teamColor) 75%
			);
		}
	}

	p {
		padding-left: 4rem;
	}
}

.holder {
	display: flex;
	flex-wrap: wrap;
	min-height: 8em;
	padding: 1em;
	gap: 1.5em;

	pointer-events: all;

	> section {
		flex: 0 1 auto;
		width: max-width;
		max-width: min(24em, 100%);
		gap: 1em;

		> h2 {}

		& * {
			outline: 1px solid #f003;
		}

		.aspects {
			display: flex;
			flex-wrap: wrap;
			flex: 0 1 auto;
			width: max-width;
			gap: .1em 1em;

			.aspect {
				flex: 0 1 auto;
				width: max-width;

				display: flex;
				flex-direction: column;
			}
		}
	}

	> .archetype {
		max-width: min(48em, 100%);
	}
}

ul {
	list-style: none;

	> li {
		> span:nth-child(1) {
			font-weight: bold;
		}
		> span:nth-child(2) {
			font-family: monospace;
		}
	}
}

`

