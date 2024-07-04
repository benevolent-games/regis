
import {nap} from "@benev/slate"
import {Orchestrator} from "@benev/toolbox"

import {nexus} from "../../nexus.js"
import {MainMenuView} from "../../views/exhibits/main-menu.js"
import {IntroPageView} from "../../views/exhibits/intro-page.js"
import {LogoSplashView} from "../../views/loading-screens/logo-splash.js"
import {loadMapEditorPayload, MapEditorView} from "../../views/exhibits/map-editor.js"

export const GameApp = nexus.lightComponent(use => {

	const orchestrator = use.once(() => {
		const intro = Orchestrator.makeExhibit({
			dispose: () => {},
			template: IntroPageView([{
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
				await nap(1000)
				return {
					dispose: () => {},
					template: MainMenuView([{
						goIntro: () => goExhibit.intro(),
						goEditor: () => goExhibit.mapEditor(),
					}]),
				}
			}),

			mapEditor: orchestrator.makeNavFn(loadscreens.logoSplash, async() => {
				await nap(1000)
				const payload = await loadMapEditorPayload()
				return {
					dispose: () => payload.dispose(),
					template: MapEditorView([payload]),
				}
			}),
		}

		return orchestrator
	})

	return Orchestrator.render(orchestrator)
})

