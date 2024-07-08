
import {SVGTemplateResult} from "@benev/slate"

export type Action = {
	label: string
	codes: string[]
	icon: null | SVGTemplateResult
}

export type Actions = Record<string, Action>
export type ActionModes = Record<string, Actions>

export function actions<A extends Actions>(a: A) {
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

