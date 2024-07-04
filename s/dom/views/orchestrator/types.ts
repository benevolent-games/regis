
import {RenderResult} from "@benev/slate"

export type Exhibit = {
	template: RenderResult
	dispose: () => void
}

export type ExhibitFn = () => Promise<Exhibit>

export type LoadingScreen = {
	animTime: number
	render: ({}: {active: boolean}) => RenderResult
}

