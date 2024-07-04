
import {html, nap} from "@benev/slate"

import styles from "./css.js"
import {nexus} from "../../nexus.js"
import {OrchestratorView} from "../../views/orchestrator/view.js"
import {Orchestrator} from "../../views/orchestrator/orchestrator.js"
import { loadMapEditorPayload, MapEditorView } from "../../views/map-editor/view.js"

export const GameApp = nexus.shadowComponent(use => {
	use.styles(styles)

	const {orchestrator} = use.once(() => {
		const home = Orchestrator.makeExhibit({
			dispose: () => {},
			template: () => html`
				<h1 @click=${() => exhibits.mainMenu()}>
					intro
				</h1>
			`,
		})

		const orchestrator = new Orchestrator(home)

		const loadingScreens = {
			logoSplash: orchestrator.makeLoadingScreen({
				animTime: 250,
				render: () => html`..orchestrator..`,
			}),
		}

		const exhibits = {
			intro: () => loadingScreens.logoSplash(async() => {
				await nap(100)
				return home
			}),
			mainMenu: () => loadingScreens.logoSplash(async() => {
				await nap(100)
				return {
					dispose: () => {},
					template: () => html`
						<p>main menu</p>
					`,
				}
			}),
			mapEditor: () => loadingScreens.logoSplash(async() => {
				await nap(100)
				const payload = await loadMapEditorPayload()
				return {
					template: () => MapEditorView([payload]),
					dispose: () => payload.dispose(),
				}
			}),
		}

		return {exhibits, orchestrator}
	})

	return OrchestratorView([orchestrator])
})

