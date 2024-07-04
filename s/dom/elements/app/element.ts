
import {nap} from "@benev/slate"

import {nexus} from "../../nexus.js"
import {MainMenuView} from "../../views/main-menu/view.js"
import {IntroPageView} from "../../views/intro-page/view.js"
import {LogoSplashView} from "../../views/logo-splash/view.js"
import {Orchestrator} from "../../views/orchestrator/orchestrator.js"
import {loadMapEditorPayload, MapEditorView} from "../../views/map-editor/view.js"

export const GameApp = nexus.lightComponent(use => {

	const {orchestrator} = use.once(() => {
		const intro = Orchestrator.makeExhibit({
			dispose: () => {},
			template: IntroPageView([{
				gotoMainMenu: () => exhibits.mainMenu()
			}]),
		})

		const orchestrator = new Orchestrator(intro)

		const loadingScreens = {
			logoSplash: orchestrator.makeLoadingScreen({
				animTime: 1000,
				render: ({active}) => {
					console.log({active})
					return LogoSplashView([])
				},
			}),
		}

		const exhibits = {
			intro: () => loadingScreens.logoSplash(async() => intro),

			mainMenu: () => loadingScreens.logoSplash(async() => {
				await nap(999)
				return {
					dispose: () => {},
					template: MainMenuView([{
						gotoIntro: () => exhibits.intro(),
						gotoEditor: () => exhibits.mapEditor(),
					}]),
				}
			}),

			mapEditor: () => loadingScreens.logoSplash(async() => {
				await nap(999)
				const payload = await loadMapEditorPayload()
				return {
					dispose: () => payload.dispose(),
					template: MapEditorView([payload]),
				}
			}),
		}

		return {exhibits, orchestrator}
	})

	return Orchestrator.render(orchestrator)
})

