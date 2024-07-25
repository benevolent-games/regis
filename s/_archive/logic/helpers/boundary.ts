
import {scalar, vec2, Vec2, Vec3} from "@benev/toolbox"

import {BoardState} from "../state/board.js"
import {CoordinatorHelper} from "./coordinator.js"

export class BoundaryHelper {
	readonly place: {min: Vec2, max: Vec2}
	readonly position: {min: Vec3, max: Vec3}

	constructor(public board: BoardState) {
		const coordinator = new CoordinatorHelper(board)

		this.place = {
			min: [0, 0],
			max: vec2.addBy(board.extent, -1),
		}

		this.position = {
			min: coordinator.toPosition(this.place.min),
			max: coordinator.toPosition(this.place.max),
		}
	}

	clampPlace([x, y]: Vec2) {
		const {min: [minX, minY], max: [maxX, maxY]} = this.place
		return [
			scalar.clamp(x, minX, maxX),
			scalar.clamp(y, minY, maxY),
		] as Vec2
	}

	clampPosition([x, y, z]: Vec3) {
		const {min: [minX,,minZ], max: [maxX,,maxZ]} = this.position
		return [
			scalar.clamp(x, minX, maxX),
			y,
			scalar.clamp(z, minZ, maxZ),
		] as Vec3
	}
}

