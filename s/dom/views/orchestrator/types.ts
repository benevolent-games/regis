
import {RenderResult} from "@benev/slate"

export type ExhibitFn = () => Promise<RenderResult>

export type LoadingScreen = {
	animTime: number
	render: ({}: {active: boolean}) => RenderResult
}

