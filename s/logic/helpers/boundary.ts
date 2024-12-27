
import {Vec2, Vec3, Scalar} from "@benev/toolbox"

import {BoardState} from "../state.js"
import {CoordinatorHelper} from "./coordinator.js"

export class BoundaryHelper {
	readonly place: {min: Vec2, max: Vec2}
	readonly position: {min: Vec3, max: Vec3}

	constructor(public board: BoardState) {
		const coordinator = new CoordinatorHelper(board)

		this.place = {
			min: Vec2.zero(),
			max: Vec2.from(board.extent).clone().subtract_(1, 1),
		}

		this.position = {
			min: coordinator.toPosition(this.place.min),
			max: coordinator.toPosition(this.place.max),
		}
	}

	clampPlace({x, y}: Vec2) {
		const {min: {x: minX, y: minY}, max: {x: maxX, y: maxY}} = this.place
		return new Vec2(
			Scalar.clamp(x, minX, maxX),
			Scalar.clamp(y, minY, maxY),
		)
	}

	clampPosition({x, y, z}: Vec3) {
		const {min: {x: minX, z: minZ}, max: {x: maxX, z: maxZ}} = this.position
		return new Vec3(
			Scalar.clamp(x, minX, maxX),
			y,
			Scalar.clamp(z, minZ, maxZ),
		)
	}
}

