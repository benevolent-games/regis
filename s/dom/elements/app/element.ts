
import {html} from "@benev/slate"
import {Orchestrator, orchestratorStyles, OrchestratorView} from "@benev/toolbox"

import styles from "./styles.js"
import {nexus} from "../../nexus.js"
import {GameplayView} from "../../views/exhibits/gameplay.js"
import {detectInputMethod} from "../../utils/input-method.js"
import {MainMenuView} from "../../views/exhibits/main-menu.js"
import {IntroPageView} from "../../views/exhibits/intro-page.js"
import {StartMemo} from "../../../director/apis/clientside.js"
import {LogoSplashView} from "../../views/loading-screens/logo-splash.js"

export const GameApp = nexus.shadowComponent(use => {
	use.styles(styles)

	use.mount(
		detectInputMethod(document, use.context.inputMethod)
	)

	const orchestrator = use.once(() => {
		const intro = Orchestrator.makeExhibit({
			dispose: () => {},
			template: () => IntroPageView({
				goMainMenu: () => goExhibit.mainMenu()
			}),
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
				console.log("nav to main menu")
				return {
					dispose: () => {},
					template: () => MainMenuView([{
						goIntro: () => goExhibit.intro(),
						goFreeplay: () => goExhibit.freeplay(),
						goVersus: (data: StartMemo) => goExhibit.versus(data),
					}]),
				}
			}),

			freeplay: orchestrator.makeNavFn(loadscreens.logoSplash, async() => {
				const {freeplayFlow} = await import("../../../flows/freeplay.js")
				const {world, uiData, dispose} = await freeplayFlow()
				return {
					dispose,
					template: () => GameplayView([world, uiData]),
				}
			}),

			versus: orchestrator.makeNavFn(loadscreens.logoSplash, async(data: StartMemo) => {
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
						template: () => GameplayView([flow.world, flow.uiData]),
					}
				else
					return {template: () => null, dispose: () => {}}
			}),
		}

		// hack to skip to freeplay
		if (window.location.hash.includes("freeplay"))
			goExhibit.freeplay()

		return orchestrator
	})

	return html`
		${OrchestratorView(orchestrator)}
		<style>${orchestratorStyles}</style>
	`
})

