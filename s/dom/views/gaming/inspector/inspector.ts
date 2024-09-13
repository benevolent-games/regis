
import {css, html} from "@benev/slate"

import {nexus} from "../../../nexus.js"
import {unitPanel} from "./panels/unit.js"
import {tilePanel} from "./panels/tile.js"
import {rosterPanel} from "./panels/roster.js"
import {Bridge} from "../../../utils/bridge.js"

export const InspectorView = nexus.shadowView(use => (
		bridge: Bridge,
	) => {

	use.name("inspector")
	use.styles(styles)

	const selection = bridge.selectaconSelection.value

	if (selection === null)
		return null

	return html`
		${tilePanel(bridge)}
		${unitPanel(bridge)}
		${rosterPanel(bridge)}
	`
})

export const styles = css`

:host {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 4em;

	text-shadow: .1em .2em .2em black;
	--team1: cyan;
	--team2: yellow;
}

.panel {
	display: flex;
	flex-direction: column;
}

h1 {
	font-size: 1.8em;

	--teamColor: #888;
	&[data-team="1"] { --teamColor: var(--team1); }
	&[data-team="2"] { --teamColor: var(--team2); }

	span.unitkind {
		color: var(--teamColor);
	}

	span.health {
		font-family: monospace;
		color: var(--teamColor);
	}

	span[data-allegiance="friendly"] { display: none; }
}

p {
	opacity: 0.5;
	font-size: 1.4em;
	font-family: serif;
	font-style: italic;
	margin-bottom: 0.3em;
}

.group {
	display: flex;
	flex-wrap: wrap;
	gap: 1em;

	& h2 {
		font-size: 1.1em;
	}

	& li {
		> span:nth-child(1) {
			opacity: 0.5;
			font-weight: bold;
		}
	}
}

ul {
	list-style: none;
}

.pricetag {
	font-family: monospace;
	font-weight: bold;
}

.meh { color: #555; }
.happy { color: #0f0; }
.angry { color: #f00; }

`

