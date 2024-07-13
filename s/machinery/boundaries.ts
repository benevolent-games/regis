
import {vec3} from "@benev/toolbox"
import {Board} from "./board/board.js"
import {Coordinator} from "./coordinator.js"

export class Boundaries {
	readonly min: vec3.Xyz
	readonly max: vec3.Xyz

	constructor(board: Board, coordinator: Coordinator) {
		const [cornerFile, cornerRank] = board.state.extent

		const corners = [
			coordinator.toPosition([0, 0]),
			coordinator.toPosition([0, cornerRank - 1]),
			coordinator.toPosition([cornerFile - 1, 0]),
			coordinator.toPosition([cornerFile - 1, cornerRank - 1]),
		]

		this.min = Object.freeze({
			x: Math.min(...corners.map(c => c[0])),
			y: 0,
			z: Math.min(...corners.map(c => c[2])),
		})

		this.max = Object.freeze({
			x: Math.max(...corners.map(c => c[0])),
			y: 2,
			z: Math.max(...corners.map(c => c[2])),
		})
	}
}

