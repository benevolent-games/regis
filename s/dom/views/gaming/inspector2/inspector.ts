
import {css, html} from "@benev/slate"

import {nexus} from "../../../nexus.js"
import {unitPanel} from "./panels/unit.js"
import {tilePanel} from "./panels/tile.js"
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
	`
})

export const styles = css`

:host {
	display: flex;
	flex-direction: column;
	gap: 2em;

	text-shadow: .1em .2em .2em black;
	--team1: cyan;
	--team2: yellow;
}

h1 {
	font-size: 1.5em;
	--teamColor: #888;
	&[data-team="1"] { --teamColor: var(--team1); }
	&[data-team="2"] { --teamColor: var(--team2); }
	&.unitkind {
		text-shadow: 0 0 .5em color-mix(
			in srgb,
			transparent,
			var(--teamColor) 75%
		);
	}
}

p {
	opacity: 0.5;
	font-size: 1.3em;
	font-family: serif;
	font-style: italic;
	margin-bottom: 0.3em;
}

.group {
	display: flex;
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

`

export const styles2 = css`

:host {
	display: flex;
	flex-direction: column;
	width: 100%;
	text-shadow: .1em .2em .2em black;
	gap: 1em;

	outline: 1px solid lime;

	--team1: cyan;
	--team2: yellow;
}

* {outline: 1px solid #f002}

hgroup {
	display: flex;
	flex-direction: column;

	h1 {
		--teamColor: #888;
		&[data-team="1"] { --teamColor: var(--team1); }
		&[data-team="2"] { --teamColor: var(--team2); }

		:is(.coords, .roster) {
			opacity: 0.4;
			font-family: monospace;
		}

		.unitkind {
			text-shadow: 0 0 .5em color-mix(
				in srgb,
				transparent,
				var(--teamColor) 75%
			);
		}
	}

	> p {
		font-size: 1.4em;
		font-family: serif;
		font-style: italic;
	}
}

.concept {
	display: flex;
	flex-wrap: wrap;
	gap: 1em;

	pointer-events: all;

	> section {
		flex: 0 1 auto;
		width: max-width;
		max-width: min(24em, 100%);

		display: flex;
		flex-direction: column;

		> h2 {
			font-size: 1.1em;
		}
	}
}

ul {
	list-style: none;

	> li {
		> span:nth-child(1) {
			font-weight: bold;
			opacity: 0.4;
		}
		> span:nth-child(2) {}
	}
}

`

