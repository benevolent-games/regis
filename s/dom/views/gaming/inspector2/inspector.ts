
import {css, html} from "@benev/slate"

import {nexus} from "../../../nexus.js"
import {Bridge} from "../../../utils/bridge.js"
import {inspectorHeadline} from "./parts/headline.js"

export const InspectorView = nexus.shadowView(use => (
		bridge: Bridge,
	) => {

	use.name("inspector")
	use.styles(styles)

	return html`
		${inspectorHeadline(bridge)}

		<div class=holder>
			<section>
				<h2>Tile</h2>
				<ul>
					<li>
						<span>elevation</span>
						<span>0</span>
					</li>
				</ul>
			</section>

			<section>
				<h2>Armed</h2>
				<ul>
					<li>
						<span>damage</span>
						<span>5</span>
					</li>
					<li>
						<span>repeats</span>
						<span>lmao</span>
					</li>
				</ul>
			</section>
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

	--team1: cyan;
	--team2: yellow;
}

h1 {
	display: flex;
	gap: 0.5em;

	--teamColor: #888;
	&[data-team-number="1"] { --teamColor: var(--team1); }
	&[data-team-number="2"] { --teamColor: var(--team2); }

	:is(.coords, .roster) {
		opacity: 0.3;
	}

	.coords {
		font-family: monospace;
		min-width: 2em;
	}

	.roster {}

	.unitkind {
		text-shadow: 0 0 .5em color-mix(in srgb, transparent, var(--teamColor) 75%);
		xxx-color: var(--teamColor);
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

.holder {
	display: flex;
	flex-wrap: wrap;
	min-height: 8em;
	gap: 0.5em;

	> * {
		flex: 0 1 auto;
	}
}

`

