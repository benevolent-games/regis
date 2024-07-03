
import {ExhibitFn, LoadingScreen} from "./types.js"
import {nap, RenderResult, signals} from "@benev/slate"

export class Orchestrator {
	exhibit = signals.signal<RenderResult>(undefined)
	loading = signals.signal<RenderResult>(undefined)

	constructor(homeExhibit: RenderResult = undefined) {
		this.exhibit.value = homeExhibit
	}

	get isLoading() {
		return !!this.loading.value
	}

	get alreadyBusy() {
		if (this.isLoading) {
			console.warn("orchestrator already busy")
			return true
		}
		return false
	}

	makeLoadingScreen(screen: LoadingScreen) {
		return async(exhibitFn: ExhibitFn) => {
			if (this.alreadyBusy)
				return

			// initially render loading and flip the active switch
			// to play the intro animation
			this.loading.value = screen.render({active: false})
			await nap(0)
			this.loading.value = screen.render({active: true})

			// load the exhibit, and also wait for animation to be done
			const [exhibitResult] = await Promise.all([
				exhibitFn(),
				nap(screen.animTime),
			])

			// display the new exhibit,
			// and disable active switch so loading it can animate the outro
			this.exhibit.value = exhibitResult
			this.loading.value = screen.render({active: false})

			// after the outro anim is done, end the loading routine
			await nap(screen.animTime)
			this.loading.value = undefined
		}
	}
}

