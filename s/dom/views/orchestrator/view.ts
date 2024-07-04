
import {html} from "@benev/slate"
import {styles} from "./css.js"
import {nexus} from "../../nexus.js"
import {Orchestrator} from "./orchestrator.js"

export const OrchestratorView = nexus.shadowView(use => (orchestrator: Orchestrator) => {
	use.name("orchestrator")
	use.styles(styles)

	return html`
		<slot name=loading ?data-is-loading=${!!orchestrator.isLoading}>
			${orchestrator.loading}
		</slot>

		<slot>
			${orchestrator.exhibit.value.template}
		</slot>
	`
})

