
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
			${inspectorPanels.unit(agent, bridge.teamId.value, selection, bridge.terminal.planner.freedom)}
			${inspectorPanels.tile(agent, selection)}
		`

	if (selection?.kind === "roster")
		return html`
			${inspectorPanels.roster(agent, selection)}
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
		&.roster { margin: 0 auto; }
		&.tile { margin-left: auto; }

		> * + * { margin-top: 0.2em; }
	}

	h1 { font-size: 1.3em; }
	h2 { font-size: 1.2em; }

	ul, ol {
		display: flex;
		flex-wrap: wrap;
		list-style: none;

		li {
			display: flex;
			gap: 0.4em;
			margin-right: 0.8em;
			> span { opacity: 0.7; }
		}
	}
`

