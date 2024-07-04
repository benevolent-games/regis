
import {Exhibit, ExhibitFn, LoadingScreen} from "./types.js"
import {nap, RenderResult, signal, Signal} from "@benev/slate"

export class Orchestrator {
	static makeExhibit = (exhibit: Exhibit) => exhibit
	static makeExhibitLoader = (fn: ExhibitFn) => fn

	exhibit: Signal<Exhibit>
	loading: Signal<RenderResult>

	constructor(startingExhibit: Exhibit) {
		this.exhibit = signal(startingExhibit)
		this.loading = signal<RenderResult>(undefined)
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
			const [exhibit] = await Promise.all([
				exhibitFn(),
				nap(screen.animTime),
			])

			// dispose the previous exhibit
			this.exhibit.value.dispose()

			// display the new exhibit,
			// and disable active switch so loading it can animate the outro
			this.exhibit.value = exhibit
			this.loading.value = screen.render({active: false})

			// after the outro anim is done, end the loading routine
			await nap(screen.animTime)
			this.loading.value = undefined
		}
	}
}

