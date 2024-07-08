
import {SVGTemplateResult} from "@benev/slate"

export type Action = {
	label: string
	codes: string[]
	icon: null | SVGTemplateResult
}

export type ActionGroup = Record<string, Action>
export type ActionModes = Record<string, ActionGroup>

export function actions<A extends ActionGroup>(a: A) {
	return a
}

export function actionModes<M extends ActionModes>(m: M) {
	return m
}

export type Input = {
	action: Action
	down: boolean
	repeat: boolean
}

export type Listener = ({}: Input) => void

