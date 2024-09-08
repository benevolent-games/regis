
import {Vec2} from "@benev/toolbox"

export class Chalkboard {
	revelations: Vec2[] = []

	reveal(place: Vec2) {
		this.revelations.push(place)
	}
}

