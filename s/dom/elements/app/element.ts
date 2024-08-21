
import {html} from "@benev/slate"
import {Orchestrator, orchestratorStyles, OrchestratorView} from "@benev/toolbox"

import {nexus} from "../../nexus.js"
import {GameplayView} from "../../views/exhibits/gameplay.js"
import {detectInputMethod} from "../../utils/input-method.js"
import {MainMenuView} from "../../views/exhibits/main-menu.js"
import {IntroPageView} from "../../views/exhibits/intro-page.js"
import {GameStartData} from "../../../director/apis/clientside.js"
import {LogoSplashView} from "../../views/loading-screens/logo-splash.js"

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
						goFreeplay: () => goExhibit.freeplay(),
						goVersus: (data: GameStartData) => goExhibit.versus(data),
					}]),
				}
			}),

			freeplay: orchestrator.makeNavFn(loadscreens.logoSplash, async() => {
				const {freeplayFlow} = await import("../../../flows/freeplay.js")
				const {world, dispose} = await freeplayFlow()
				return {
					dispose,
					template: () => GameplayView([world]),
				}
			}),

			versus: orchestrator.makeNavFn(loadscreens.logoSplash, async(data: GameStartData) => {
				const {connectivity} = use.context
				const {versusFlow} = await import("../../../flows/versus.js")
				const flow = await versusFlow({
					data,
					connectivity,
					exit: () => goExhibit.mainMenu(),
				})
				if (flow)
					return {
						dispose: flow.dispose,
						template: () => GameplayView([flow.world]),
					}
				else
					return {template: () => null, dispose: () => {}}
			}),
		}

		// // hack skip to freeplay
		// goExhibit.freeplay()

		return orchestrator
	})

	return html`
		${OrchestratorView(orchestrator)}
		<style>${orchestratorStyles}</style>
	`
})

