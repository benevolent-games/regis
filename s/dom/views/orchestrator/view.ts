
import {html} from "@benev/slate"
import {styles} from "./css.js"
import {nexus} from "../../nexus.js"
import {Orchestrator} from "./orchestrator.js"

export const OrchestratorView = nexus.shadowView(use => (orchestrator: Orchestrator) => {
	use.styles(styles)

	return html`
		<div class=loading ?data-is-loading=${!!orchestrator.isLoading}>
			${orchestrator.loading}
		</div>

		<div class=exhibit>
			${orchestrator.exhibit}
		</div>
	`
})

