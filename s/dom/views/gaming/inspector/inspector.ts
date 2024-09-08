
import {css, html} from "@benev/slate"

import {nexus} from "../../../nexus.js"
import {Bridge} from "../../../utils/bridge.js"
import {inspectorPanels} from "./inspector-panels.js"

export const InspectorView = nexus.shadowView(use => (
		bridge: Bridge,
	) => {

	use.name("inspector")
	use.styles(styles)

	const agent = bridge.agent.value
	const selection = bridge.selectaconSelection.value

	if (selection?.kind === "tile")
		return html`
			${inspectorPanels.unit(agent, bridge.teamId.value, selection, bridge.terminal.planner.activities.unitTaskTracker)}
			${inspectorPanels.tile(agent, selection, bridge.teamId.value)}
		`

	if (selection?.kind === "roster")
		return html`
			${inspectorPanels.roster(agent, selection, bridge.teamId.value)}
		`

	else
		return null
})

export const styles = css`
	:host {
		display: flex;
		justify-content: space-between;
		align-items: end;
		width: 100%;
	}

	.panel {
		flex: 0 1 auto;
		padding: 1em;
		width: 24em;

		text-shadow: 1px 2px 1px #0004;

		&.unit { margin-right: auto; }
		&.roster { margin-right: auto; }
		&.tile { margin-left: auto; }

		> * + * { margin-top: 0.4em; }
	}

	.price {
		font-family: monospace;
		font-weight: normal;
		color: white;
	}

	h1 { font-size: 1.3em; }
	h2 { font-size: 1.2em; }
	h3 { font-size: 1.15em; }
	.essay { margin-bottom: 1em; }
	.angry { color: #d00; }
	.happy { color: #0a0; }
	.health-pattern { color: #fae; }
	h2, h3 { color: #99ca; }

	ul, ol {
		display: flex;
		flex-wrap: wrap;
		list-style: none;

		li {
			display: flex;
			gap: 0.2em;
			margin-right: 0.4em;
			> span { opacity: 0.7; }
		}
	}
`

