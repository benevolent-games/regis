
import {html, nap} from "@benev/slate"
import {Orchestrator, orchestratorStyles, OrchestratorView} from "@benev/toolbox/x/ui/orchestrator/exports.js"

import {nexus} from "../../nexus.js"
import {freeplayFlow} from "../../../game/flows/freeplay.js"
import {detectInputMethod} from "../../utils/input-method.js"
import {MainMenuView} from "../../views/exhibits/main-menu.js"
import {IntroPageView} from "../../views/exhibits/intro-page.js"
import {LogoSplashView} from "../../views/loading-screens/logo-splash.js"
import { GameplayView } from "../../views/exhibits/gameplay.js"

export const GameApp = nexus.lightComponent(use => {

	use.mount(
		detectInputMethod(document, use.context.inputMethod)
	)

	const orchestrator = use.once(() => {
		const intro = Orchestrator.makeExhibit({
			dispose: () => {},
			template: () => IntroPageView([{
				goMainMenu: () => goExhibit.mainMenu()
			}]),
		})

		const orchestrator = new Orchestrator({
			animTime: 250,
			startingExhibit: intro,
		})

		const loadscreens = {
			logoSplash: Orchestrator.makeLoadingScreen({
				render: ({}) => LogoSplashView([]),
			}),
		}

		const goExhibit = {
			intro: orchestrator.makeNavFn(loadscreens.logoSplash, async() => {
				return intro
			}),

			mainMenu: orchestrator.makeNavFn(loadscreens.logoSplash, async() => {
				return {
					dispose: () => {},
					template: () => MainMenuView([{
						goIntro: () => goExhibit.intro(),
						goEditor: () => goExhibit.mapEditor(),
					}]),
				}
			}),

			mapEditor: orchestrator.makeNavFn(loadscreens.logoSplash, async() => {
				const {EditorCore} = await import("../../../game/editor/core.js")
				const {MapEditorView} = await import("../../views/exhibits/map-editor.js")
				const editorCore = await EditorCore.load(window)
				return {
					dispose: () => editorCore.dispose(),
					template: () => MapEditorView([editorCore]),
				}
			}),

			gameplay: orchestrator.makeNavFn(loadscreens.logoSplash, async() => {
				const {freeplayFlow} = await import("../../../game/flows/freeplay.js")
				const {world, dispose} = await freeplayFlow()
				return {
					dispose,
					template: () => GameplayView([world]),
				}
			}),
		}

		// TODO remove hack to skip menus
		goExhibit.gameplay()

		return orchestrator
	})

	return html`
		${OrchestratorView(orchestrator)}
		<style>${orchestratorStyles}</style>
	`
})

