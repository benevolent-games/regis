
import {SVGTemplateResult} from "@benev/slate"

export type Action = {
	label: string
	buttons: string[]
	icon: null | SVGTemplateResult
}

export type Actions = Record<string, Action>
export type Modes = Record<string, Actions>

export function actions<A extends Actions>(a: A) {
	return a
}

export function modes<M extends Modes>(m: M) {
	return m
}

export type Input = {
	down: boolean
	repeat: boolean
}

export type Listener = ({}: Input) => void

