
import {Vec2} from "@benev/toolbox"

export type FnPickTilePlace = (pointing: {clientX: number, clientY: number}) => (Vec2 | undefined)

