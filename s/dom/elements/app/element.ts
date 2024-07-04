
import {nap} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {MainMenuView} from "../../views/main-menu/view.js"
import {IntroPageView} from "../../views/intro-page/view.js"
import {LogoSplashView} from "../../views/logo-splash/view.js"
import {Orchestrator} from "../../views/orchestrator/orchestrator.js"
import {loadMapEditorPayload, MapEditorView} from "../../views/map-editor/view.js"

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

