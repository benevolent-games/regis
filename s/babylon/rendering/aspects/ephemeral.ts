
import {Prop, Vec2} from "@benev/toolbox"
import {Trashbin} from "../../../tools/trashbin.js"

export type Ephemeral = ReturnType<typeof makeEphemeral>

export function makeEphemeral() {
	const trashbin = new Trashbin()
	const blockPlacements = new Map<Prop, Vec2>()
	return {
		trashbin,
		blockPlacements,
		wipe() {
			trashbin.dispose()
			blockPlacements.clear()
		}
	}
}

